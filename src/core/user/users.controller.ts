import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Res
} from '@nestjs/common'
import { Response } from 'express'
import { Auth } from 'src/decorators/auth.decorator'
import { JwtUser } from 'src/decorators/jwtUser.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findById(id)
	}

	@Get('activate/:activationLink')
	activate(@Param('activationLink') activationLink: string, @Res() response: Response) {
		return this.usersService.activate(activationLink, response)
	}

	@HttpCode(HttpStatus.OK)
	@Patch()
	@Auth()
	update(@JwtUser('id') id: string, @Body() dto: UpdateUserDto) {
		return this.usersService.update(id, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Delete()
	@Auth()
	remove(@JwtUser('id') id: string) {
		return this.usersService.remove(id)
	}
}
