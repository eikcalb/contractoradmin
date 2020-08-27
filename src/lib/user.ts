export class User {
    firstName
    lastName
    profileImageURL
    token
    description
    jobType?: "onsite" | "remote"
    rating: number = 5
    joinDate
    contact
    activeTask
    skillsAndLicenses?: string[]
    lastPasswordChanged?: number
    email
    id
}

export const DUMMY_USER: User = new User()

DUMMY_USER.firstName = "John"
DUMMY_USER.lastName = "Doe"
DUMMY_USER.id = 'unique'
DUMMY_USER.email = 'a@example.com'
DUMMY_USER.description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam vero iure, ducimus, explicabo vel nesciunt eveniet, enim quis quos ex autem!"
DUMMY_USER.jobType = 'onsite'
DUMMY_USER.contact = '080838111111'
DUMMY_USER.rating = 4.2
DUMMY_USER.lastPasswordChanged = Date.now()
DUMMY_USER.joinDate = "20.07.2020"
DUMMY_USER.skillsAndLicenses = ['Farming', 'Poultry']
DUMMY_USER.profileImageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTv3f3Zf2onEOPtpRtWPoRX6SWQUSpV_GBB6Q&usqp=CAU"
