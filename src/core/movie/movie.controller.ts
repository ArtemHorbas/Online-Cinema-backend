import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query
} from '@nestjs/common'
import { Movie } from '@prisma/client'
import { Auth } from 'src/decorators/auth.decorator'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieService } from './movie.service'

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@Auth()
	create(@Body() dto: CreateMovieDto): Promise<Movie> {
		return this.movieService.create(dto)
	}

	@Get()
	findAll(@Query('searchTerm') searchTerm?: string): Promise<Movie[]> {
		return this.movieService.findAll(searchTerm)
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<Movie> {
		return this.movieService.findOne(id)
	}

	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	@Auth()
	update(@Param('id') id: string, @Body() dto: UpdateMovieDto): Promise<Movie> {
		return this.movieService.update(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	@Auth()
	remove(@Param('id') id: string): Promise<Movie> {
		return this.movieService.remove(id)
	}
}
