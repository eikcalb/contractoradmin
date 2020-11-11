import { createContext } from "react"
import validator from "validator"
import { IRegister } from "../components/auth"
import CONFIG from "./config"
import { initializeStorage, KEYS, localforage } from "./storage"
import { DUMMY_USER, User } from "./user"

interface ISettings {
    lastUserName: string
}

const DEFAULT_SETTINGS = {
    lastUserName: ''
}

export class Application {
    config: Config
    user?: User
    ready: Promise<boolean>

    protected settings: ISettings = DEFAULT_SETTINGS

    logoutListener?: () => any
    loginListener?: () => any

    constructor(config: Config) {
        this.config = config
        this.ready = new Promise(async (res, rej) => {
            try {
                await this.init()
                res(true)
            } catch (e) {
                // if an error occurred during initialization, throw the error and handle within the application
                console.log(e)
                return rej(e)
            }
        })
    }

    /**
     * Initialize application dependencies.
     * 
     * Dependencies that fail to load should fail silently at this stage, unless required for application to function.
     */
    async init() {
        await initializeStorage(this)

        try {
            const appData: ISettings | null = await localforage.getItem(KEYS.APP_DATA)
            if (appData) {
                this.settings = appData
            }
        } catch (e) {
            console.info(e, 'No app data persisted!')
        }

        // check for existing user session
        try {
            await this.inflateUser()
            // If user session exists, trigger login listener
            if (this.loginListener) {
                this.loginListener()
            }
        } catch (e) {
            console.log(e)
        }

        return true
    }


    signedIn(): boolean {
        return this.user && this.user?.token
    }


    async updateSettings(options: Partial<ISettings>) {
        if (!options) {
            throw new Error('Empty options provided!')
        }
        if (JSON.stringify(options) === JSON.stringify(this.settings)) {
            return
        }

        this.settings = {
            ...this.settings,
            ...options
        }

        return await localforage.setItem(KEYS.APP_DATA, this.settings)
    }

    async initiateNetworkRequest(path: string, request?: RequestInit, authenticated = false): Promise<Response> {
        const reqObj: RequestInit = {
            ...request,
            referrerPolicy: 'no-referrer',
            headers: {
                ...request?.headers,
                Accept: 'application/json',
                Authorization: authenticated ? `Bearer ${this.user?.token}` : request?.headers?.['Authorization'],
                'Content-Type': 'application/json'
            }
        }

        const resp = await fetch(`${this.config.hostname}${path}`, reqObj)
        if (resp.status === 401) {
            if (!this.user) {
                throw new Error("Unauthenticated access not allowed!")
            }
            // Authorization failed. This usually means the token has expired and refresh token could not be used to regenerate token
            //
            // Try to reauthenticate the user
            try {
                const { token } = await this.reauthenticate()
                this.user.token = token
                // since token is generated already, retry the request
                if (reqObj && reqObj.headers && reqObj.headers['Authorization']) {
                    reqObj.headers['Authorization'] = `Bearer ${token}`
                }
                return await this.initiateNetworkRequest(path, reqObj)
            } catch (e) {
                await this.logout()
                throw e || new Error("App session expired. Login to continue!")
            }
        }
        return resp
    }

    protected async reauthenticate(): Promise<{ token: string }> {
        // No logic to reauthenticate. Throw error, forcing user to logout.
        throw new Error("Failed to authenticate user!")
    }

    protected async inflateUser() {
        // inflate user session
        let session: User | null = await localforage.getItem(KEYS.USER_SESSION)
        if (!session) throw new Error("No session available for user!")

        this.user = new User(session)
        return this.user
    }

    protected async persistUser() {
        if (!this.user) {
            throw new Error('No user created!')
        }

        await localforage.setItem(KEYS.USER_SESSION, this.user)
    }

    async validateNumber(phone: string) {
        if (!phone) {
            throw new Error("Phone number must be provided!")
        }
        phone = phone.trim()
        if (!phone || !validator.isMobilePhone(phone)) {
            throw new Error("Invalid phone number provided!")
        }
        if (!phone.startsWith('+')) {
            throw new Error("Phone number must begin with '+' and contain country code!")
        }

        const response = await this.initiateNetworkRequest(`/users/phone/${encodeURIComponent(phone)}`, {
            method: 'GET',
        })
        if (!response.ok) {
            throw new Error((await response.json())?.message || "Verification failed!")
        }

        const jsonResponse = await response.json()
        if (!jsonResponse.valid) {
            throw new Error('Invalid phone number (ensure phone number is associated with a user)!')
        }

        return true
    }

    async triggerVerification(phone: string, channel: string = 'sms') {
        if (!phone) {
            throw new Error("Phone number must be provided!")
        }
        phone = phone.trim()

        if (!phone || !validator.isMobilePhone(phone)) {
            throw new Error("Invalid phone number provided!")
        }
        if (!phone.startsWith('+')) {
            throw new Error("Phone number must begin with '+' and contain country code!")
        }

        const response = await this.initiateNetworkRequest('/users/sms_registration', {
            method: 'POST',
            body: JSON.stringify({ phone_number: phone, channel })
        })
        if (!response.ok) {
            throw new Error((await response.json())?.message || "Verification failed!")
        }

        return true
    }

    async login(username, code, password) {
        try {
            await this.validateLogin(username, code, password)

            const response = await this.initiateNetworkRequest('/users/login', {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ phone_number: username, code, password })
            })
            if (!response.ok) {
                throw new Error((await response.json())?.message || "Login failed!")
            }

            const jsonResponse = await response.json()
            if (!jsonResponse.success) {
                throw new Error("Login failed!")
            }
            this.user = await User.getUser(this, jsonResponse.userName, jsonResponse.token)
            if (this.user.role !== 'admin') {
                throw new Error("Authenticated access only allowed for administrators!")
            }

            await this.persistUser()
            if (this.loginListener) {
                this.loginListener()
            }

            return this.user

        } catch (e) {
            throw e
        }
    }

    protected async validateLogin(phone: string, code: string, password: string) {
        if (!phone || !password || !code) {
            throw new Error("Credentials not provided!")
        }
        phone = phone.trim()

        if (!phone || !validator.isMobilePhone(phone)) {
            throw new Error("Invalid phone number provided!")
        }
        if (!phone.startsWith('+')) {
            throw new Error("Phone number must begin with '+' and contain country code!")
        }
        if (!validator.matches(password, /.{6,}/i)) {
            throw new Error("Invalid password provided (Password must be more than 6 characters)!")
        }
        if (!validator.matches(code, /[0-9]{4}/)) {
            throw new Error("Invalid code provided (provided code must have 4 digits)!")
        }
    }

    // TODO
    async addAdmin(data: IRegister) {
        try {
            await this.validateRegister(data)

            const response = await this.initiateNetworkRequest('/users/new', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    role: 'admin',
                    // TODO: change to 'pending'
                    account_status: 'accepted'
                })
            })
            if (!response.ok) {
                throw new Error((await response.json())?.message)
            }

            const jsonResponse = await response.json()

            return jsonResponse
        } catch (e) {
            throw e
        }
    }

    protected async validateRegister(data: IRegister) {
        let { email, password, first_name, last_name, password_verify, phone_number } = data
        if (!email || !password) {
            throw new Error("Credentials not provided!")
        }
        if (password !== password_verify) {
            throw new Error('Passwords do not match!')
        }
        email = email.trim()
        first_name = first_name.trim()
        last_name = last_name.trim()
        if (!first_name || !last_name) {
            throw new Error('Firstname and lastname must be provided!')
        }
        if (!email || !validator.isEmail(email)) {
            throw new Error("Invalid username provided!")
        }
        if (!phone_number || !validator.isMobilePhone(phone_number)) {
            throw new Error("Invalid phone number provided!")
        }
        if (!phone_number.startsWith('+')) {
            throw new Error("Phone number must begin with '+' and contain country code!")
        }
        if (!validator.matches(password, /.{6,}/i)) {
            throw new Error("Invalid password provided (Password must be more than 6 characters)!")
        }
    }


    async logout() {
        this.user = undefined
        await localforage.removeItem(KEYS.USER_SESSION)
        //await localforage.removeItem(KEYS.REFRESH_TOKEN)
        if (this.logoutListener) {
            this.logoutListener()
        }
    }
}

export const DEFAULT_APPLICATION = new Application(CONFIG)
DEFAULT_APPLICATION.user = DUMMY_USER
/**
 * This is the application context used within the web application.
 * 
 * This context provided the application engine and is not tied to any view rendering.
 * 
 * The underlying aplication object exposes the required functions and do not modify the view.
 * This underlying object is made available to all React components via the application context.
 * 
 * All view rendering is managed in React.
 * 
 * **VIEW RENDERING SHOULD NOT DEPEND ON ANY PROPERTY OF THIS CONTEXT**
 */
export const APPLICATION_CONTEXT = createContext<Application>(DEFAULT_APPLICATION)

/**
 * This context is used for managing the views within the web app.
 * Activities such as loading and splashscreen are implemented using this context.
 */
export const VIEW_CONTEXT = createContext<{
    setSignedIn: any,
    signedIn: null | User,
    setAppReady: any,
    showToolbar: any,
    showFooter: any
}>({
    setSignedIn: (signedIn) => { },
    signedIn: null,
    setAppReady: (ready: boolean) => { },
    showToolbar: (show: boolean) => { },
    showFooter: (footer) => { }
})

export interface Config {
    name: string
    version: string
    description: string
    hostname: string
}
