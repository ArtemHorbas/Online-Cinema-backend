import { forwardRef, Module } from '@nestjs/common'
import { ViewsModule } from '../views/views.module'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'

@Module({
	imports: [forwardRef(() => ViewsModule)],
	controllers: [MovieController],
	providers: [MovieService],
	exports: [MovieService]
})
export class MovieModule {}
