import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { JwtUser } from 'src/decorators/jwtUser.decorator'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingService } from './rating.service'

@Controller('rating')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Post()
	@Auth()
	setRating(@JwtUser('id') authorId: string, @Body() dto: SetRatingDto): Promise<number> {
		return this.ratingService.setRating(authorId, dto)
	}

	@Get(':movieId')
	@Auth()
	getMovieValueForUser(
		@JwtUser('id') userId: string,
		@Param('movieId') movieId: string
	): Promise<number> {
		return this.ratingService.getMovieValueForUser(userId, movieId)
	}
}
