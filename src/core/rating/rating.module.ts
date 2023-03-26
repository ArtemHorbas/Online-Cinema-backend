import { Module } from '@nestjs/common'
import { MovieModule } from '../movie/movie.module'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'

@Module({
	imports: [MovieModule],
	controllers: [RatingController],
	providers: [RatingService]
})
export class RatingModule {}
