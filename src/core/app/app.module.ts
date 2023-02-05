import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMailerConfig } from 'src/config/mailer.config'
import { AuthModule } from '../auth/auth.module'
import { DatabaseModule } from '../database/database.module'
import { MailModule } from '../mail/mail.module'
import { MediaModule } from '../media/media.module'
import { MovieModule } from '../movie/movie.module'
import { ReviewModule } from '../review/review.module'
import { TokenModule } from '../token/token.module'
import { UsersModule } from '../user/users.module'
import { ViewsModule } from '../views/views.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMailerConfig
		}),
		DatabaseModule,
		UsersModule,
		AuthModule,
		MailModule,
		TokenModule,
		MediaModule,
		MovieModule,
		ViewsModule,
		ReviewModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
