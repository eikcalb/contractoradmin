export class User {
    firstName
    lastName
    profileImageURL
    token
    description
    rating: number = 5
    id
}

export const DUMMY_USER: User = new User()

DUMMY_USER.firstName = "John"
DUMMY_USER.lastName = "Doe"
DUMMY_USER.id = 'unique'
DUMMY_USER.description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam vero iure, ducimus, explicabo vel nesciunt eveniet, enim quis quos ex autem! Natus itaque dolore atque voluptatem nam tempore quasi nihil fugiat facere impedit. Sint sunt, dolores esse accusantium eveniet saepe quas sapiente culpa cupiditate cum perspiciatis ex explicabo, voluptatibus itaque fugit fugiat labore quibusdam quo veniam voluptates? Blanditiis accusantium fugiat aperiam iure nobis architecto totam illum aut tempora, assumenda possimus incidunt dolor nemo nulla laborum debitis harum eaque qui suscipit, maxime, excepturi vel pariatur voluptate. Voluptatum exercitationem perferendis cum, distinctio explicabo sed delectus laboriosam, ea nostrum est autem minima magnam."
DUMMY_USER.rating = 4.2
DUMMY_USER.profileImageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTv3f3Zf2onEOPtpRtWPoRX6SWQUSpV_GBB6Q&usqp=CAU"
