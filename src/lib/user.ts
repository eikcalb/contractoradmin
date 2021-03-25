import { IJobHistory } from "./job";
import { IEducationHistory, ILicense } from "./education";
import { Application } from ".";

export const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjdlMDFmOTBiMjRmNzAwMTcyZmRkOTQiLCJlbWFpbCI6Inp6QGdtYWlsLmNvbSIsInBob25lX251bWJlciI6IisyMzQ4MDgzODIxNzgyIiwiaWF0IjoxNjE1NjYzNDQ4fQ.nHEwobqCa4yT1z27ydwpSHPg_6s4CEp1QarlJGU1HUo"
export const DUMMY_TOKEN_SECRET = "secret"

class AppUser {
    id
    role: string
    firstName: string
    lastName: string
    occupation: string
    city: string
    state: string
    starRate: number = 5.0
    email: string
    password?: string
    phoneNumber: string
    profilePhoto: string
    profileBio?: string
    dateCreated?: Date
    accountStatus: string = "Pending"
    workHistory: IJobHistory[] = []
    educationalBackground: IEducationHistory[] = []
    skills: string[] = []
    licenses: ILicense[] = []

    constructor(data, raw?: boolean) {
        if (raw) {
            this.role = data.role
            this.firstName = data.first_name
            this.lastName = data.last_name
            this.occupation = data.occupation
            this.starRate = data.star_rate
            this.dateCreated = data.date_created
            this.city = data.city
            this.email = data.email
            this.accountStatus = data.account_status
            this.educationalBackground = data.educational_background
            this.phoneNumber = data.phone_number
            this.profilePhoto = data.profile_photo
            this.state = data.state
            this.skills = data.skills
        } else {
            this.role = data.role
            this.firstName = data.firstName
            this.lastName = data.lastName
            this.occupation = data.occupation
            this.starRate = data.starRate
            this.dateCreated = data.dateCreated
            this.city = data.city
            this.email = data.email
            this.accountStatus = data.accountStatus
            this.educationalBackground = data.educationalBackground
            this.phoneNumber = data.phoneNumber
            this.profilePhoto = data.profilePhoto
            this.state = data.state
            this.skills = data.skills
        }

        this.id = data.id
    }
}

export class User extends AppUser {
    get profileImageURL() {
        return this.profilePhoto
    }
    token
    jobType?: "onsite" | "remote"
    activeTask
    lastPasswordChanged?: number

    constructor(data, raw?: boolean) {
        super(data, raw)
        this.token = data.token
        this.jobType = data.jobType
        this.activeTask = data.activeTask
        this.lastPasswordChanged = data.lastPasswordChanged
    }

    /**
     * 
     * @param app Application object
     * @param id Identity of user whose detail will be fetched
     * @param token Secret token obtained from logging into the application.
     */
    static async getUser(app: Application, id: string, token: string) {
        try {
            const response = await app.initiateNetworkRequest(`/users/${id}`, {
                method: 'GET',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            if (!response.ok) {
                throw new Error((await response.json())?.message || "Failed to fetch user data!")
            }

            const jsonResponse = await response.json()
            const user = new User(jsonResponse, true)
            user.id = id
            user.token = token

            return user

        } catch (e) {
            throw e
        }
    }

    /**
       * 
       * @param app Application object
       * @param id Identity of user whose detail will be fetched
       */
    static async getExternalUser(app: Application, id: string): Promise<User> {
        try {
            const response = await app.initiateNetworkRequest(`/users/${id}`, {
                method: 'GET',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                },
            }, true)
            if (!response.ok) {
                throw new Error((await response.json())?.message || "Failed to fetch user data!")
            }

            const jsonResponse = await response.json()
            const user = new User(jsonResponse, true)
            user.id = id

            return user
        } catch (e) {
            console.log('failed to fetch user data', e)
            return new User({})
        }
    }
}

export const DUMMY_USER: User = new User({})

DUMMY_USER.firstName = "Johnathan"
DUMMY_USER.lastName = "Doe"
DUMMY_USER.id = 'unique'
DUMMY_USER.email = 'a@example.com'
DUMMY_USER.profileBio = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam vero iure, ducimus, explicabo vel nesciunt eveniet, enim quis quos ex autem!"
DUMMY_USER.jobType = 'onsite'
DUMMY_USER.phoneNumber = '080838111111'
DUMMY_USER.starRate = 4.2
DUMMY_USER.lastPasswordChanged = Date.now()
DUMMY_USER.dateCreated = new Date("20/07/2020")
DUMMY_USER.skills = ['Farming', 'Poultry']
// DUMMY_USER.profileImageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTv3f3Zf2onEOPtpRtWPoRX6SWQUSpV_GBB6Q&usqp=CAU"
