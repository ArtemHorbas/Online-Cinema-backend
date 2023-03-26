import { Role } from '@prisma/client'
import { IsEmail, IsString } from 'class-validator'

export class SetRoleDto {
	@IsEmail()
	email: string

	@IsString()
	name: string

	@IsString()
	role: Role
}
