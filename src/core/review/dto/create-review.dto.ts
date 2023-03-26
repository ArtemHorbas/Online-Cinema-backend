import { IsString } from 'class-validator'

export class CreateReviewDto {
	@IsString()
	description: string

	@IsString()
	movieId: string
}
