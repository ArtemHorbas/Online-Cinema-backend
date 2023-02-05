import { UseGuards } from '@nestjs/common'
import { RTAuthGuard } from 'src/guards/rt.guard'

export const RtCheck = () => UseGuards(RTAuthGuard)
