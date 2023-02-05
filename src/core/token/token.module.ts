import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersModule } from '../user/users.module'
import { TokenService } from './token.service'

@Module({
	imports: [UsersModule],
	providers: [TokenService, JwtService],
	exports: [TokenService]
})
export class TokenModule { }
