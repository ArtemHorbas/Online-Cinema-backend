import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class RTAuthGuard extends AuthGuard('rt-jwt') { }
