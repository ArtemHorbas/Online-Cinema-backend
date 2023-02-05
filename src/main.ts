import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './core/app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const PORT = process.env.PORT || 6100

	app.useGlobalPipes(new ValidationPipe())
	app.enableCors()
	app.use(cookieParser())
	app.setGlobalPrefix('api')

	await app.listen(PORT)
}
bootstrap()
