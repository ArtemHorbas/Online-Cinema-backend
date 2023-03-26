import { Controller, Param, Patch } from '@nestjs/common'
import { ViewsService } from './views.service'

@Controller('views')
export class ViewsController {
	constructor(private readonly viewsService: ViewsService) {}

	//@Get('movie/:movieSlug')
	//findViewsInMovie(@Param('movieSlug') movieSlug: string) {
	//	return this.viewsService.findViewsInMovie(movieSlug)
	//}

	@Patch('update/:movieId')
	updateViewsInMovie(@Param('movieId') movieId: string) {
		return this.viewsService.updateViews(movieId)
	}
}
