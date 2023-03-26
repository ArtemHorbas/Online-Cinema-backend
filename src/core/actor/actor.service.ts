import { Injectable, NotFoundException } from '@nestjs/common'
import { AppError } from 'src/utils/enums/errors'
import { PrismaService } from '../database/prisma.service'
import { CreateActorDto } from './dto/create-actor.dto'
import { UpdateActorDto } from './dto/update-actor.dto'

@Injectable()
export class ActorService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateActorDto) {
		return await this.prisma.actor.create({
			data: {
				name: dto.name,
				slug: dto.slug,
				photo: dto.photo
			}
		})
	}

	async findAll(searchTerm?: string, count?: number) {
		let take: number

		if (count) take = count
		else take = undefined

		return await this.prisma.actor.findMany({
			where: {
				name: {
					contains: searchTerm,
					mode: 'insensitive'
				}
			},
			orderBy: {
				movies: {
					_count: 'desc'
				}
			},
			include: {
				movies: true
			},
			take
		})
	}

	async findById(id: string) {
		const actor = await this.prisma.actor.findUnique({
			where: {
				id
			},
			include: {
				movies: true
			}
		})
		if (!actor) throw new NotFoundException(AppError.INCORRECT_REQUEST)

		return actor
	}

	async findBySlug(slug: string) {
		return await this.prisma.actor.findUnique({
			where: {
				slug
			}
		})
	}

	async update(id: string, dto: UpdateActorDto) {
		return await this.prisma.actor.update({
			where: {
				id
			},
			data: dto
		})
	}

	async remove(id: string) {
		return await this.prisma.actor.delete({
			where: { id }
		})
	}
}
