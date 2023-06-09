import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from 'src/core/user/user.service'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt-jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					const data = request?.cookies['refreshToken']
					return data ? data : null
				}
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('RT_SECRET')
		})
	}

	validate({ id }: Pick<User, 'id'>) {
		return this.userService.findById(id)
	}
}
