import { IsString, IsNumber } from 'class-validator'

export class SetRatingDto {
	@IsString()
	movieId: string

	@IsNumber()
	value: number
}
