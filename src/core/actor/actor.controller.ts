import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Actor } from '@prisma/client'
import { ActorService } from './actor.service'
import { CreateActorDto } from './dto/create-actor.dto'
import { UpdateActorDto } from './dto/update-actor.dto'

@Controller('actor')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Post()
	create(@Body() createActorDto: CreateActorDto): Promise<Actor> {
		return this.actorService.create(createActorDto)
	}

	@Get()
	findAll(@Query('searchTerm') searchTerm?: string, @Query('take') take?: string) {
		return this.actorService.findAll(searchTerm, +take)
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.actorService.findById(id)
	}

	@Get('by-slug/:slug')
	findOne(@Param('slug') slug: string) {
		return this.actorService.findBySlug(slug)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
		return this.actorService.update(id, updateActorDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.actorService.remove(id)
	}
}
