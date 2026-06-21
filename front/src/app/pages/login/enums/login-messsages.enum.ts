export enum LOGIN_MESSAGES {
  SUCCESS = '¡El inicio de sesión fue exitoso!',
  INVALID_CREDENTIALS = 'No fue posible iniciar sesión. Por favor, revise los datos ingresados.',
  INVALID_ACCESS_USER_DISABLED = 'No es posible iniciar sesión. Contáctese con el administrador.',
}

export enum LOGIN_ERROR_CODES {
  ALREADY_EXISTS = 'user_already_exists',
  CHARACTERS = 'characters',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_DISABLED = 'USER_DISABLED',
}
