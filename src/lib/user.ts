import { IJobHistory } from "./job";
import { IEducationHistory, ILicense } from "./education";

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

    constructor(data) {
        this.role = data.role
        this.firstName = data.first_name
        this.lastName = data.last_name
        this.occupation = data.occupation
        this.city = data.city
        this.email = data.email
        this.state = data.state
        this.phoneNumber = data.phone_number
        this.profilePhoto = data.profile_photo
    }
}

export class User extends AppUser {
    get profileImageURL(){
        return this.profilePhoto
    }
    token
    jobType?: "onsite" | "remote"
    activeTask
    lastPasswordChanged?: number
}

export const DUMMY_USER: User = new User({})

DUMMY_USER.firstName = "John"
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
