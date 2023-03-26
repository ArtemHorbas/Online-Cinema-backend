import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Movie, Role, User } from '@prisma/client'
import { hash } from 'argon2'
import { Response } from 'express'
import { AppError } from 'src/utils/enums/errors'
import { Message } from 'src/utils/types/types'
import { PrismaService } from '../database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SetRoleDto } from './dto/set-role.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ExtendedUser, ReducedUser } from './types/user.types'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	async create(dto: CreateUserDto): Promise<User> {
		return await this.prisma.user.create({
			data: {
				email: dto.email,
				password: dto.password,
				name: dto.name,
				avatar: dto.avatar
			}
		})
	}

	async findAll(searchTerm?: string): Promise<ReducedUser[]> {
		return await this.prisma.user.findMany({
			where: {
				email: {
					contains: searchTerm,
					mode: 'insensitive'
				},
				role: {
					not: Role.OWNER
				}
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true
			}
		})
	}

	async findById(id: string): Promise<ExtendedUser> {
		return await this.prisma.user.findUnique({
			where: { id },
			include: {
				reviews: true,
				favourites: {
					include: {
						genres: true
					}
				}
			}
		})
	}

	async findProfile(user: ExtendedUser) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			avatar: user.avatar,
			role: user.role,
			isActivated: user.isActivated,
			favouritesCount: user.favourites.length,
			reviewsCount: user.reviews.length
		}
	}

	async findByEmail(email: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { email }
		})
	}

	async findFavourites(id: string): Promise<Movie[]> {
		const user = await this.findById(id)

		return user.favourites
	}

	async isFavourite(movieId: string, userId: string): Promise<boolean> {
		const { favourites } = await this.prisma.user.findFirst({
			where: {
				id: userId
			},
			include: {
				favourites: {
					where: {
						id: movieId
					}
				}
			}
		})

		if (!favourites.length) return false

		return true
	}

	async addToFavourites(movieId: string, userId: string): Promise<Message> {
		const user = await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				favourites: { connect: { id: movieId } }
			}
		})
		if (!user) throw new NotFoundException(AppError.INCORRECT_REQUEST)

		return {
			message: 'Added'
		}
	}

	async removeFromFavourites(movieId: string, userId: string): Promise<Message> {
		const user = await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				favourites: { disconnect: { id: movieId } }
			}
		})
		if (!user) throw new NotFoundException(AppError.INCORRECT_REQUEST)

		return {
			message: 'Deleted'
		}
	}

	async toggleFavourites(movieId: string, userId: string): Promise<Message> {
		const isFavourite = await this.isFavourite(movieId, userId)

		if (isFavourite) return await this.removeFromFavourites(movieId, userId)
		return await this.addToFavourites(movieId, userId)
	}

	async update(id: string, dto: UpdateUserDto): Promise<Message> {
		if (dto.password) dto.password = await hash(dto.password)

		const res = await this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				password: dto.password,
				name: dto.name,
				avatar: dto.avatar
			}
		})
		if (!res) throw new BadRequestException(AppError.INCORRECT_REQUEST)

		return {
			message: 'Updated'
		}
	}

	async setRole(id: string, dto: SetRoleDto): Promise<Message> {
		const res = await this.prisma.user.update({
			where: { id },
			data: {
				role: dto.role,
				name: dto.name,
				email: dto.email
			}
		})
		if (!res) throw new BadRequestException(AppError.INCORRECT_REQUEST)

		return {
			message: 'Updated'
		}
	}

	async activate(id: string, response: Response) {
		const res = await this.prisma.user.updateMany({
			where: {
				id,
				isActivated: false
			},
			data: {
				isActivated: true
			}
		})
		if (!res) throw new BadRequestException('User has already been activated')

		response.redirect(this.configService.get('CLIENT_URL'))
	}

	async updateRT(id: string, rtHash: string) {
		await this.prisma.user.update({
			where: { id },
			data: {
				rtHash
			}
		})
	}

	async removeRT(id: string) {
		await this.prisma.user.updateMany({
			where: {
				id,
				rtHash: {
					not: null
				}
			},
			data: {
				rtHash: null
			}
		})
	}

	async remove(id: string): Promise<boolean> {
		const res = await this.prisma.user.delete({
			where: { id }
		})
		if (!res) throw new NotFoundException(AppError.USER_NOT_EXISTS)

		return true
	}
}
