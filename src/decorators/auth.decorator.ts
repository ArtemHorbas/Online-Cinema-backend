import { UseGuards } from '@nestjs/common'
import { ATAuthGuard } from '../guards/at.guard'

export const Auth = () => UseGuards(ATAuthGuard)
