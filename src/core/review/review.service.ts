import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'

@Injectable()
export class ReviewService {
	constructor(private readonly prisma: PrismaService) {}

	async create(authorId: string, dto: CreateReviewDto) {
		return await this.prisma.review.create({
			data: {
				description: dto.description,
				movieId: dto.movieId,
				authorId
			}
		})
	}

	async findByMovie(movieId: string) {
		return await this.prisma.review.findMany({
			where: {
				movie: {
					id: movieId
				}
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						avatar: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async findTotalReviews() {
		return await this.prisma.review.count()
	}

	async update(id: string, dto: UpdateReviewDto) {
		return await this.prisma.review.update({
			where: { id },
			data: dto
		})
	}

	async remove(id: string) {
		return await this.prisma.review.delete({
			where: { id }
		})
	}
}
