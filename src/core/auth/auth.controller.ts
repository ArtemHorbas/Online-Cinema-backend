import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { User } from '@prisma/client'
import { Response } from 'express'
import { Cookies } from 'src/decorators/cookie.decorator'
import { JwtUser } from 'src/decorators/jwtUser.decorator'
import { RtCheck } from 'src/decorators/rtAuth.decorator'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { UserLoginDto } from './dto/user-login.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
		return this.authService.register(dto, response)
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() dto: UserLoginDto, @Res({ passthrough: true }) response: Response) {
		return this.authService.login(dto, response)
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	@RtCheck()
	logout(@JwtUser('id') userId: string, @Res({ passthrough: true }) response: Response) {
		return this.authService.logout(userId, response)
	}

	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	@RtCheck()
	refreshTokens(
		@Cookies('refreshToken') refreshToken: string,
		@JwtUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		return this.authService.refresh(refreshToken, user, response)
	}
}
