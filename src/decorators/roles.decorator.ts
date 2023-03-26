import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { ATAuthGuard } from 'src/guards/at.guard'
import { RolesGuard } from 'src/guards/roles.guard'

export const ROLES_KEY = 'roles'

export const RolesCheck = (...roles: Role[]) => {
	return applyDecorators(
		SetMetadata(ROLES_KEY, roles),
		UseGuards(ATAuthGuard, RolesGuard)
	)
}
