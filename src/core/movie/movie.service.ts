import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Movie, Prisma } from '@prisma/client'
import { AppError } from 'src/utils/enums/errors'
import { PrismaService } from '../database/prisma.service'
import { ViewsService } from '../views/views.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { GetByGenresDto } from './dto/get-by-genres.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'

@Injectable()
export class MovieService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => ViewsService))
		private readonly viewsService: ViewsService
	) {}

	async create(dto: CreateMovieDto): Promise<{ res: 'Created' }> {
		const movie = await this.prisma.movie.create({
			data: {
				name: dto.name,
				slug: dto.slug,
				fees: dto.fees,
				poster: dto.poster,
				bigPoster: dto.bigPoster,
				video: dto.video,
				params: {
					create: {
						year: dto.params.year,
						duration: dto.params.duration,
						country: dto.params.country
					}
				},
				genres: { connect: dto.genres.map(genre => ({ slug: genre })) },
				actors: { connect: dto.actors.map(actor => ({ slug: actor })) }
			}
		})

		await this.viewsService.updateViews(movie.id)

		return {
			res: 'Created'
		}
	}

	async findAll(searchTerm?: string, sort?: string, count?: number): Promise<Movie[]> {
		let orderBy: Prisma.MovieOrderByWithRelationAndSearchRelevanceInput
		let take: number

		switch (sort) {
			case 'rating':
				orderBy = {
					avgRating: 'desc'
				}
				break

			case 'views':
				orderBy = {
					sumViews: 'desc'
				}
				break

			case 'fees':
				orderBy = {
					fees: 'desc'
				}
				break

			default:
				orderBy = {
					createdAt: 'desc'
				}
				break
		}

		switch (count) {
			case count:
				take = count
				break

			default:
				take = undefined
				break
		}

		return await this.prisma.movie.findMany({
			where: {
				name: {
					contains: searchTerm,
					mode: 'insensitive'
				}
			},
			include: {
				params: true,
				reviews: true,
				views: true,
				genres: true,
				actors: true
			},
			orderBy,
			take
		})
	}

	async findByGenres(dto: GetByGenresDto): Promise<Movie[]> {
		return await this.prisma.movie.findMany({
			where: {
				genres: {
					some: {
						slug: {
							in: dto.genres
						}
					}
				}
			}
		})
	}

	async findByActor(slug: string): Promise<Movie[]> {
		return await this.prisma.movie.findMany({
			where: {
				actors: {
					some: {
						slug
					}
				}
			}
		})
	}

	async findById(id: string): Promise<Movie> {
		const movie = await this.prisma.movie.findUnique({
			where: {
				id
			},
			include: {
				params: true,
				genres: true,
				actors: true
			}
		})
		if (!movie) throw new NotFoundException(AppError.INCORRECT_REQUEST)

		return movie
	}

	async findBySlug(slug: string): Promise<Movie> {
		const movie = await this.prisma.movie.findUnique({
			where: {
				slug
			},
			include: {
				params: true,
				genres: true,
				actors: true,
				reviews: {
					orderBy: {
						createdAt: 'desc'
					},
					select: {
						id: true,
						description: true,
						createdAt: true,
						author: {
							select: {
								id: true,
								name: true,
								avatar: true
							}
						}
					}
				}
			}
		})
		if (!movie) throw new NotFoundException(AppError.INCORRECT_REQUEST)

		return movie
	}

	async findTotalMovies(): Promise<number> {
		return await this.prisma.movie.count()
	}

	async findtTotalAvarage(): Promise<number> {
		const res = await this.prisma.movie.aggregate({
			_avg: {
				avgRating: true
			}
		})

		return res._avg.avgRating
	}

	async findTotalFees(): Promise<number> {
		const res = await this.prisma.movie.aggregate({
			_sum: {
				fees: true
			}
		})

		return res._sum.fees
	}

	async update(id: string, dto: UpdateMovieDto): Promise<{ res: 'Updated' }> {
		const res = await this.prisma.movie.update({
			where: { id },
			data: {
				...dto,
				params: {
					update: {
						year: dto.params.year,
						duration: dto.params.duration,
						country: dto.params.country
					}
				},
				genres: { set: dto.genres.map(genre => ({ slug: genre })) },
				actors: { set: dto.actors.map(actor => ({ slug: actor })) }
			}
		})
		if (!res) throw new BadRequestException(AppError.INCORRECT_REQUEST)

		return {
			res: 'Updated'
		}
	}

	async updateRating(id: string, rating: number) {
		await this.prisma.movie.update({
			where: { id },
			data: {
				avgRating: rating
			}
		})
	}

	async incrementViews(id: string) {
		await this.prisma.movie.update({
			where: { id },
			data: {
				sumViews: { increment: 1 }
			}
		})
	}

	async remove(id: string): Promise<{ res: 'Deleted' }> {
		const res = await this.prisma.movie.delete({
			where: { id }
		})
		if (!res) throw new NotFoundException('Movie not exists')

		return {
			res: 'Deleted'
		}
	}
}
