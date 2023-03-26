import { forwardRef, Module } from '@nestjs/common'
import { MovieModule } from '../movie/movie.module'
import { ViewsController } from './views.controller'
import { ViewsService } from './views.service'

@Module({
	imports: [forwardRef(() => MovieModule)],
	controllers: [ViewsController],
	providers: [ViewsService],
	exports: [ViewsService]
})
export class ViewsModule {}
