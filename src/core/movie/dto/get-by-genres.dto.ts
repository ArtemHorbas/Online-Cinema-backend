import { IsArray, IsString } from 'class-validator'

export class GetByGenresDto {
	@IsArray()
	@IsString({ each: true })
	genres: string[]
}
