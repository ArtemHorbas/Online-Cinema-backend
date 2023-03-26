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
import { Role } from '@prisma/client'
import { RolesCheck } from 'src/decorators/roles.decorator'
import { CreateGenreDto } from './dto/create-genre.dto'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { GenreService } from './genre.service'

@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	@RolesCheck(Role.ADMIN, Role.OWNER)
	create(@Body() dto: CreateGenreDto) {
		return this.genreService.create(dto)
	}

	@Get()
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.findAll(searchTerm)
	}

	@Get('with-movies')
	findWithMovies() {
		return this.genreService.findWithMovies()
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.genreService.findById(id)
	}

	@Get('by-slug/:slug')
	findBySlug(@Param('slug') slug: string) {
		return this.genreService.findBySlug(slug)
	}

	@Get('sort/popular')
	findPopular() {
		return this.genreService.findPopular()
	}

	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
		return this.genreService.update(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	@RolesCheck(Role.ADMIN, Role.OWNER)
	remove(@Param('id') id: string) {
		return this.genreService.remove(id)
	}
}
