import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Query,
	Res
} from '@nestjs/common'
import { Movie, Review, Role, User } from '@prisma/client'
import { Response } from 'express'
import { Auth } from 'src/decorators/auth.decorator'
import { JwtUser } from 'src/decorators/jwtUser.decorator'
import { RolesCheck } from 'src/decorators/roles.decorator'
import { SetRoleDto } from './dto/set-role.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll(
		@Query('searchTerm') searchTerm?: string
	): Promise<Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt'>[]> {
		return this.userService.findAll(searchTerm)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Get('current/profile')
	@Auth()
	findProfile(@JwtUser() user: User & { favourites: Movie[]; reviews: Review[] }) {
		return this.userService.findProfile(user)
	}

	@Get('favourite/movies')
	@Auth()
	findFavourites(@JwtUser('id') userId: string) {
		return this.userService.findFavourites(userId)
	}

	@Get('favourite/:movieId')
	@Auth()
	isInFavourites(@Param('movieId') movieId: string, @JwtUser('id') userId: string) {
		return this.userService.isFavourite(movieId, userId)
	}

	@HttpCode(HttpStatus.OK)
	@Patch('favourite/:movieId')
	@Auth()
	toggleFavourites(@Param('movieId') movieId: string, @JwtUser('id') userId: string) {
		return this.userService.toggleFavourites(movieId, userId)
	}

	@Get('activate/:activationLink')
	activate(@Param('activationLink') activationLink: string, @Res() response: Response) {
		return this.userService.activate(activationLink, response)
	}

	@HttpCode(HttpStatus.OK)
	@Patch()
	@Auth()
	update(@JwtUser('id') id: string, @Body() dto: UpdateUserDto) {
		return this.userService.update(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	@RolesCheck(Role.OWNER)
	setRole(@Param('id') id: string, @Body() dto: SetRoleDto) {
		return this.userService.setRole(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Delete()
	@Auth()
	remove(@JwtUser('id') id: string) {
		return this.userService.remove(id)
	}
}
