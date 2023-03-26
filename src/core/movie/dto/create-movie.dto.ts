import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'

class MovieParams {
	@IsNumber()
	year: number

	@IsNumber()
	duration: number

	@IsString()
	country: string
}

export class CreateMovieDto {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsNumber()
	fees: number

	@IsObject()
	params: MovieParams

	@IsArray()
	@IsString({ each: true })
	genres: string[]

	@IsArray()
	@IsString({ each: true })
	actors: string[]

	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsString()
	video: string
}
