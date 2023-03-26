import { Movie, Review, User } from '@prisma/client'

export interface ExtendedUser extends User {
	favourites: Movie[]
	reviews: Review[]
}

export interface ReducedUser
	extends Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt'> {}
