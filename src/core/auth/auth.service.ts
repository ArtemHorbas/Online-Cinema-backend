import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'
import { AppError } from 'src/utils/enums/errors'
import * as uuid from 'uuid'
import { MailService } from '../mail/mail.service'
import { TokenService } from '../token/token.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { UsersService } from '../user/users.service'
import { UserLoginDto } from './dto/user-login.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService
	) {}

	async register(dto: CreateUserDto, response: Response) {
		const existUser = await this.userService.findFullOne(dto.email)
		if (existUser) throw new BadRequestException(AppError.USER_EXIST)

		dto.password = await this.hashData(dto.password)
		const activationLink = uuid.v4()

		const user = await this.userService.create(dto, activationLink)
		await this.mailService.sendActivationMail(
			dto.email,
			`${this.configService.get('API_URL')}/api/user/activate/${activationLink}`
		)

		const { accessToken, refreshToken } = this.tokenService.generateJwtTokens(user.id)
		const rt_hash = await this.hashData(refreshToken)
		await this.userService.updateRT(user.id, rt_hash)

		response.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return {
			user,
			accessToken
		}
	}

	async login(dto: UserLoginDto, response: Response) {
		const existUser = await this.userService.findFullOne(dto.email)
		if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST)

		const validatePassword = await bcrypt.compare(dto.password, existUser.password)
		if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA)

		const { accessToken, refreshToken } = this.tokenService.generateJwtTokens(
			existUser.id
		)

		const rt_hash = await this.hashData(refreshToken)
		await this.userService.updateRT(existUser.id, rt_hash)

		response.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return {
			user: await this.userService.findById(existUser.id),
			accessToken
		}
	}

	async logout(id: string, response: Response) {
		await this.userService.removeRT(id)
		response.clearCookie('refreshToken')
	}

	async refresh(rt: string, user: User, response: Response) {
		const validateToken = await bcrypt.compare(rt, user.rt_hash)
		if (!validateToken) throw new ForbiddenException(AppError.ACCESS_DENIED)

		const { accessToken, refreshToken } = this.tokenService.generateJwtTokens(user.id)

		const rt_hash = await this.hashData(refreshToken)
		await this.userService.updateRT(user.id, rt_hash)

		response.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		})

		return {
			user: await this.userService.findById(user.id),
			accessToken
		}
	}

	//HELPERS
	async hashData(data: string): Promise<string> {
		const salt = await bcrypt.genSalt(10)

		return bcrypt.hash(data, salt)
	}
}
