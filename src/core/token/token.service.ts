import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	generateJwtTokens(userId: string): { accessToken: string; refreshToken: string } {
		const payload = {
			id: userId
		}

		const accessToken = this.jwtService.sign(payload, {
			secret: this.configService.get('AT_SECRET'),
			expiresIn: this.configService.get('AT_EXPIRE')
		})

		const refreshToken = this.jwtService.sign(payload, {
			secret: this.configService.get('RT_SECRET'),
			expiresIn: this.configService.get('RT_EXPIRE')
		})

		return {
			accessToken,
			refreshToken
		}
	}
}
