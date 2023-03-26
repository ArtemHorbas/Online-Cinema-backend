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
import { Movie, Role } from '@prisma/client'
import { RolesCheck } from 'src/decorators/roles.decorator'
import { CreateMovieDto } from './dto/create-movie.dto'
import { GetByGenresDto } from './dto/get-by-genres.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieService } from './movie.service'

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@RolesCheck(Role.ADMIN, Role.OWNER)
	create(@Body() dto: CreateMovieDto): Promise<{ res: 'Created' }> {
		return this.movieService.create(dto)
	}

	@Get()
	findAll(
		@Query('searchTerm') searchTerm?: string,
		@Query('sort') sort?: string,
		@Query('take') take?: string
	): Promise<Movie[]> {
		return this.movieService.findAll(searchTerm, sort, +take)
	}

	@HttpCode(HttpStatus.OK)
	@Post('/by-genres')
	findByGenres(@Body() dto: GetByGenresDto): Promise<Movie[]> {
		return this.movieService.findByGenres(dto)
	}

	@Get('by-actor/:slug')
	findByActor(@Param('slug') slug: string): Promise<Movie[]> {
		return this.movieService.findByActor(slug)
	}

	@Get('by-id/:id')
	findById(@Param('id') id: string): Promise<Movie> {
		return this.movieService.findById(id)
	}

	@Get('by-slug/:slug')
	findBySlug(@Param('slug') slug: string): Promise<Movie> {
		return this.movieService.findBySlug(slug)
	}

	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateMovieDto): Promise<{ res: 'Updated' }> {
		return this.movieService.update(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	@RolesCheck(Role.ADMIN, Role.OWNER)
	remove(@Param('id') id: string): Promise<{ res: 'Deleted' }> {
		return this.movieService.remove(id)
	}
}
