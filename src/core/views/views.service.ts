import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Prisma, Views } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { MovieService } from '../movie/movie.service'
import { ViewsByMonth } from './types/views.types'

@Injectable()
export class ViewsService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(forwardRef(() => MovieService))
		private readonly movieService: MovieService
	) {}

	async updateViews(movieId: string) {
		await this.movieService.incrementViews(movieId)

		const row = await this.findViewsRow(movieId)
		if (row) return await this.incrementViewsInRow(row.id)

		return await this.createViewsRow(movieId)
	}

	async createViewsRow(movieId: string) {
		return await this.prisma.views.create({
			data: {
				movieId
			}
		})
	}

	async incrementViewsInRow(rowId: string) {
		return await this.prisma.views.update({
			where: {
				id: rowId
			},
			data: {
				count: { increment: 1 }
			}
		})
	}

	async findViewsRow(movieId: string): Promise<Views> {
		const res = await this.prisma.$queryRaw(
			Prisma.sql`
				SELECT *
				FROM "Views"
				WHERE (movie_id = ${movieId} AND date_part('month', (SELECT current_timestamp)) = EXTRACT(MONTH FROM created_at));
			`
		)

		return res[0]
	}

	async findViewsByMonth(): Promise<ViewsByMonth[]> {
		return await this.prisma.$queryRaw(
			Prisma.sql`
				SELECT CAST(SUM(count) as int) as views, TO_CHAR(TO_DATE(EXTRACT(MONTH FROM created_at)::text, 'MM'), 'Mon')  as month
				FROM "Views"	
				GROUP BY EXTRACT(MONTH FROM created_at)
				ORDER BY EXTRACT(MONTH FROM created_at) ASC;
			`
		)
	}

	//async findViewsWithMovie() {
	//	return await this.prisma.$queryRaw(
	//		Prisma.sql`
	//			SELECT  "Movie".id, "Movie".slug, "Movie".name, "Movie".poster, "Movie".fees, "Movie".rating,  CAST(SUM(count) as int) as views
	//			FROM "MovieViews" JOIN "Movie" ON movie_slug = "Movie".slug
	//			GROUP BY "Movie".id
	//			ORDER BY SUM(count) DESC
	//		`
	//	)
	//}

	//async findViewsInMovie(movieId: string) {
	//	const data = await this.prisma.views.groupBy({
	//		by: ['movieId'],
	//		where: {
	//			movieId
	//		},
	//		_sum: {
	//			count: true
	//		}
	//	})
	//	if (!data.length) throw new NotFoundException('There is no views')

	//	return data[0]._sum.count
	//}

	//async findViewsDataForEachMovie() {
	//	return await this.prisma.views.groupBy({
	//		by: ['movieId'],
	//		where: {
	//			count: {
	//				gt: 0
	//			}
	//		},
	//		_sum: {
	//			count: true
	//		},
	//		take: 4,
	//		orderBy: {
	//			_sum: {
	//				count: 'desc'
	//			}
	//		}
	//	})
	//}

	async findTotalViews(): Promise<number> {
		const res = await this.prisma.views.aggregate({
			_sum: {
				count: true
			}
		})

		return res._sum.count
	}
}
