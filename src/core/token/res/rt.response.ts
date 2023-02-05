import { User } from '@prisma/client'

export interface RTResopnse {
  refreshToken: string
  user: User
}
