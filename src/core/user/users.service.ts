import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { Response } from 'express'
import { AppError } from 'src/utils/enums/errors'
import { PrismaService } from '../database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	async create(dto: CreateUserDto, activationLink: string) {
		return await this.prisma.user.create({
			data: {
				email: dto.email,
				password: dto.password,
				name: dto.name,
				avatar: dto.avatar,
				activationLink
			},
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				isActivated: true,
				createdAt: true,
				updatedAt: true,
				reviews: true
			}
		})
	}

	async findAll() {
		return await this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				isActivated: true,
				createdAt: true,
				updatedAt: true,
				reviews: true
			}
		})
	}

	async findById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				isActivated: true,
				createdAt: true,
				updatedAt: true,
				reviews: true
			}
		})
		if (!user) throw new NotFoundException(AppError.USER_NOT_EXIST)

		return user
	}

	async findFullOne(email: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { email }
		})
	}

	async findFullOneById(id: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { id }
		})
	}

	async update(id: string, dto: UpdateUserDto) {
		return await this.prisma.user.update({
			where: { id },
			data: dto,
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				isActivated: true,
				createdAt: true,
				updatedAt: true,
				reviews: true
			}
		})
	}

	async activate(activationLink: string, response: Response) {
		await this.prisma.user.updateMany({
			where: {
				activationLink,
				isActivated: false
			},
			data: {
				isActivated: true
			}
		})
		response.redirect(this.configService.get('CLIENT_URL'))
	}

	async updateRT(id: string, rt_hash: string) {
		await this.prisma.user.update({
			where: { id },
			data: {
				rt_hash
			}
		})
	}

	async removeRT(id: string) {
		await this.prisma.user.updateMany({
			where: {
				id,
				rt_hash: {
					not: null
				}
			},
			data: {
				rt_hash: null
			}
		})
	}

	async remove(id: string) {
		return await this.prisma.user.delete({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				avatar: true,
				isActivated: true,
				createdAt: true,
				updatedAt: true,
				reviews: true
			}
		})
	}
}
