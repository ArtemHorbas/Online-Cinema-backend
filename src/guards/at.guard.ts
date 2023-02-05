import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class ATAuthGuard extends AuthGuard('at-jwt') { }
