import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/core/user/users.service'

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at-jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('AT_SECRET')
		})
	}

	validate({ id }: Pick<User, 'id'>) {
		return this.userService.findById(id)
	}
}
