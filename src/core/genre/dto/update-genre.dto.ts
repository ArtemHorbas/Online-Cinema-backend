import { PartialType } from '@nestjs/mapped-types'
import { CreateMovieDto } from 'src/core/movie/dto/create-movie.dto'

export class UpdateGenreDto extends PartialType(CreateMovieDto) {}
