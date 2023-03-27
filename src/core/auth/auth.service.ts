import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { AppError } from 'src/utils/enums/errors'
import { MailService } from '../mail/mail.service'
import { TokenService } from '../token/token.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { UserService } from '../user/user.service'
import { UserLoginDto } from './dto/user-login.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService
	) {}

	async register(dto: CreateUserDto, response: Response) {
		const existUser = await this.userService.findByEmail(dto.email)
		if (existUser) throw new BadRequestException(AppError.USER_EXISTS)

		dto.password = await hash(dto.password)

		const user = await this.userService.create(dto)
		await this.mailService.sendActivationMail(
			user.email,
			`${this.configService.get('API_URL')}/user/activate/${user.id}`
		)

		const { accessToken, refreshToken } = this.tokenService.generateJwtTokens(user.id)
		const rt_hash = await hash(refreshToken)
		await this.userService.updateRT(user.id, rt_hash)

		response.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return {
			user: this.returnUserFields(user),
			accessToken
		}
	}

	async login(dto: UserLoginDto, response: Response) {
		const existUser = await this.userService.findByEmail(dto.email)
		if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXISTS)

		const validatePassword = await verify(existUser.password, dto.password)
		if (!validatePassword) throw new BadRequestException(AppError.INCORRECT_USER_REQUEST)

		const { accessToken, refreshToken } = this.tokenService.generateJwtTokens(existUser.id)

		const rt_hash = await hash(refreshToken)
		await this.userService.updateRT(existUser.id, rt_hash)

		response.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return {
			user: this.returnUserFields(existUser),
			accessToken
		}
	}

	async logout(id: string, response: Response) {
		await this.userService.removeRT(id)
		response.clearCookie('refreshToken')
	}

	async refresh(rt: string, user: User, response: Response) {
		const validateToken = await verify(user.rtHash, rt)
		if (!validateToken) throw new ForbiddenException(AppError.ACCESS_DENIED)

		const { accessToken, refreshToken } = this.tokenService.generateJwtTokens(user.id)

		const rt_hash = await hash(refreshToken)
		await this.userService.updateRT(user.id, rt_hash)

		response.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return {
			user: this.returnUserFields(user),
			accessToken
		}
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			role: user.role
		}
	}
}
