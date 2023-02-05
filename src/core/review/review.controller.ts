import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { JwtUser } from 'src/decorators/jwtUser.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@Auth()
	create(@JwtUser('id') authorId: string, @Body() dto: CreateReviewDto) {
		return this.reviewService.create(authorId, dto)
	}

	@Get('movie/:movieName')
	findForMovie(@Param('movieName') movieName: string) {
		return this.reviewService.findForMovie(movieName)
	}

	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	@Auth()
	update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
		return this.reviewService.update(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	@Auth()
	remove(@Param('id') id: string) {
		return this.reviewService.remove(id)
	}
}
