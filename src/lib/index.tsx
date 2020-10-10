import React, { createContext } from "react"
import CONFIG from "./config"
import { Redirect } from "react-router-dom"
import { User, DUMMY_USER } from "./user"
import { initializeStorage, KEYS, localforage } from "./storage"
import validator from "validator"
import { isNewExpression } from "typescript"

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
                Authorization: authenticated ? `Bearer ${this.user?.token}` : '',
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


    async triggerVerification(phone: string, channel: string = 'sms') {
        if (!phone) {
            throw new Error("Phone number must be provided!")
        }
        phone = phone.trim()

        if (!phone || !validator.isMobilePhone(phone)) {
            throw new Error("Invalid phone number provided!")
        }

        const response = await this.initiateNetworkRequest('/users/sms_registration', {
            method: 'POST',
            body: JSON.stringify({ phone_number: phone, channel })
        })
        if (!response.ok) {
            throw new Error((await response.json())?.error || "Verification failed!")
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
                body: JSON.stringify({ email: username, password })
            })
            if (!response.ok) {
                throw new Error((await response.json())?.error || "Login failed!")
            }

            const jsonResponse = await response.json()
            console.log(jsonResponse, 'Token generated upon login')
            this.user = new User(jsonResponse)
            await this.persistUser()

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
        if (!validator.matches(password, /.{6,}/i)) {
            throw new Error("Invalid password provided (Password must be more than 6 characters)!")
        }
        if (!validator.matches(code, /[0-9]{4}/)) {
            throw new Error("Invalid code provided (provided code must have 4 digits)!")
        }
    }

    // TODO
    async addAdmin(data) {
        try {
            await this.validateRegister(data)

            const response = await this.initiateNetworkRequest('/admin/persons/new', {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': `${this.user?.token}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            const jsonResponse = await response.json()
            const user = new User(jsonResponse)

            return user

        } catch (e) {
            throw e
        }
    }

    // TODO
    protected async validateRegister(data) {
        let { email, password, firstName, lastName, passwordVerify } = data
        if (!email || !password) {
            throw new Error("Credentials not provided!")
        }
        if (password !== passwordVerify) {
            throw new Error('Passwords do not match!')
        }
        email = email.trim()
        firstName = firstName.trim()
        lastName = lastName.trim()
        if (!firstName || !lastName) {
            throw new Error('Firstname and lastname must be provided!')
        }
        if (!email || !validator.isEmail(email)) {
            throw new Error("Invalid username provided!")
        }
        if (!validator.matches(password, /[a-zA-z0-9]{6,}/i)) {
            throw new Error("Invalid password provided (Password must be alphanumeric and more than 6 characters)!")
        }
    }


    async logout() {
        this.user = undefined
        localforage.removeItem(KEYS.USER_SESSION)
        localforage.removeItem(KEYS.REFRESH_TOKEN)
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
