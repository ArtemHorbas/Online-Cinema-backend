export const enum AppError {
	INCORRECT_REQUEST = 'Incorrect request data',
	INCORRECT_USER_REQUEST = 'Incorrect email or password',

	USER_EXISTS = 'User with this email has already been registered',
	USER_NOT_EXISTS = 'User with this email did not exist',

	ACCESS_DENIED = 'Acces Denied'
}
