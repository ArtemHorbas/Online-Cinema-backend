import { Injectable } from '@nestjs/common'
import { MovieService } from '../movie/movie.service'
import { ReviewService } from '../review/review.service'
import { ViewsService } from '../views/views.service'
import { DeepStatistics, MainStatistics } from './types/statistics.types'

@Injectable()
export class StatisticsService {
	constructor(
		private readonly viewsService: ViewsService,
		private readonly movieServiece: MovieService,
		private readonly reviewServiece: ReviewService
	) {}

	async getMainStatistic(): Promise<MainStatistics> {
		return {
			totalMovies: await this.movieServiece.findTotalMovies(),
			totalReviews: await this.reviewServiece.findTotalReviews(),
			avgRating: await this.movieServiece.findtTotalAvarage(),
			totalViews: await this.viewsService.findTotalViews()
		}
	}

	async getDeepStatistic(): Promise<DeepStatistics> {
		return {
			totalFees: await this.movieServiece.findTotalFees(),
			viewsByMonth: await this.viewsService.findViewsByMonth()
		}
	}
}
