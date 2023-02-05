import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'
import { ViewsModule } from '../views/views.module'

@Module({
  imports: [ViewsModule],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule { }
