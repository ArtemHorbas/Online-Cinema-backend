import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MediaService } from './media.service'
import { IMediaResponse } from './res/media.response'

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) { }

	@HttpCode(HttpStatus.OK)
	@Post()
	@UseInterceptors(FileInterceptor('media'))
	uploadMediaFile(
		@UploadedFile() mediaFile: Express.Multer.File,
		@Query('folder') folder?: string
	): Promise<IMediaResponse> {
		return this.mediaService.saveMedia(mediaFile, folder)
	}
}
