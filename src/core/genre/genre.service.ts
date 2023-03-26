import { Injectable, NotFoundException } from '@nestjs/common'
import { Genre } from '@prisma/client'
import { AppError } from 'src/utils/enums/errors'
import { PrismaService } from '../database/prisma.service'
import { CreateGenreDto } from './dto/create-genre.dto'
import { UpdateGenreDto } from './dto/update-genre.dto'

@Injectable()
export class GenreService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateGenreDto): Promise<Genre> {
		return await this.prisma.genre.create({
			data: {
				slug: dto.slug,
				name: dto.name,
				description: dto.description,
				icon: dto.icon
			}
		})
	}

	async findAll(searchTerm?: string) {
		return await this.prisma.genre.findMany({
			where: {
				name: {
					contains: searchTerm,
					mode: 'insensitive'
				}
			}
		})
	}

	async findPopular() {
		return await this.prisma.genre.findMany({
			where: {
				movies: {
					some: {}
				}
			},
			orderBy: {
				movies: {
					_count: 'desc'
				}
			},
			take: 4
		})
	}

	async findWithMovies() {
		return await this.prisma.genre.findMany({
			where: {
				movies: {
					some: {}
				}
			},
			include: {
				movies: true
			}
		})
	}

	async findById(id: string) {
		const genre = await this.prisma.genre.findUnique({
			where: {
				id
			}
		})
		if (!genre) throw new NotFoundException(AppError.INCORRECT_REQUEST)

		return genre
	}

	async findBySlug(slug: string) {
		return await this.prisma.genre.findUnique({
			where: {
				slug
			}
		})
	}

	async update(id: string, dto: UpdateGenreDto) {
		return await this.prisma.genre.update({
			where: { id },
			data: dto
		})
	}

	async remove(id: string) {
		return await this.prisma.genre.delete({
			where: { id }
		})
	}
}
