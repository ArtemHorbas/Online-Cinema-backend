import { Module } from '@nestjs/common'
import { MovieModule } from '../movie/movie.module'
import { ReviewModule } from '../review/review.module'
import { ViewsModule } from '../views/views.module'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	imports: [MovieModule, ReviewModule, ViewsModule],
	controllers: [StatisticsController],
	providers: [StatisticsService]
})
export class StatisticsModule {}
