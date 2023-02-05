import { IsNumber, IsString } from 'class-validator'

export class CreateMovieDto {
  @IsString()
  name: string

  @IsNumber()
  rating: number

  @IsNumber()
  fees: number

  poster: string
}
