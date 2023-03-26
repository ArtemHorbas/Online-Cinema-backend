import { Module } from '@nestjs/common'
import { AtStrategy } from 'src/strategies/at.strategy'
import { RtStrategy } from 'src/strategies/rt.strategy'
import { MailModule } from '../mail/mail.module'
import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [UserModule, TokenModule, MailModule],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy, RtStrategy]
})
export class AuthModule {}
