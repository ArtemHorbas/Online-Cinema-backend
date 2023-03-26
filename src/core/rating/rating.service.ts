import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { MovieService } from '../movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'

@Injectable()
export class RatingService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly movieSevice: MovieService
	) {}

	async setRating(authorId: string, dto: SetRatingDto) {
		const isExists = await this.getMovieValueForUser(authorId, dto.movieId)

		if (isExists) await this.updateRatingRow(authorId, dto)
		else await this.createRatingRow(authorId, dto)

		const avarageRating = await this.avarageRatingByMovie(dto.movieId)

		await this.movieSevice.updateRating(dto.movieId, avarageRating)

		return dto.value
	}

	async createRatingRow(authorId: string, dto: SetRatingDto) {
		return await this.prisma.rating.create({
			data: {
				movieId: dto.movieId,
				value: dto.value,
				authorId
			}
		})
	}

	async updateRatingRow(authorId: string, dto: SetRatingDto) {
		return await this.prisma.rating.updateMany({
			where: {
				authorId,
				movieId: dto.movieId
			},
			data: {
				value: dto.value
			}
		})
	}

	async getMovieValueForUser(authorId: string, movieId: string): Promise<number> {
		const data = await this.prisma.rating.findFirst({
			where: {
				movieId,
				authorId
			},
			select: {
				value: true
			}
		})
		if (!data) return 0

		return data.value
	}

	async avarageRatingByMovie(movieId: string) {
		const data = await this.prisma.rating.groupBy({
			by: ['movieId'],
			where: {
				movieId
			},
			_avg: {
				value: true
			}
		})
		if (!data.length) throw new NotFoundException('There is no rating')

		return data[0]._avg.value
	}
}
