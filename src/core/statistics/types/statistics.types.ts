import { ViewsByMonth } from 'src/core/views/types/views.types'

export interface MainStatistics {
	totalMovies: number
	totalReviews: number
	avgRating: number
	totalViews: number
}

export interface DeepStatistics {
	totalFees: number
	viewsByMonth: ViewsByMonth[]
}
