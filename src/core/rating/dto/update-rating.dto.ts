import { PartialType } from '@nestjs/mapped-types'
import { SetRatingDto } from './set-rating.dto'

export class UpdateRatingDto extends PartialType(SetRatingDto) {}
