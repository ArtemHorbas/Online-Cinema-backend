import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMailerConfig } from 'src/config/mailer.config'
import { ActorModule } from '../actor/actor.module'
import { AuthModule } from '../auth/auth.module'
import { DatabaseModule } from '../database/database.module'
import { GenreModule } from '../genre/genre.module'
import { MailModule } from '../mail/mail.module'
import { MediaModule } from '../media/media.module'
import { MovieModule } from '../movie/movie.module'
import { RatingModule } from '../rating/rating.module'
import { ReviewModule } from '../review/review.module'
import { StatisticsModule } from '../statistics/statistics.module'
import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'
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
		UserModule,
		AuthModule,
		MailModule,
		TokenModule,
		MediaModule,
		MovieModule,
		ViewsModule,
		RatingModule,
		ReviewModule,
		GenreModule,
		ActorModule,
		StatisticsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
