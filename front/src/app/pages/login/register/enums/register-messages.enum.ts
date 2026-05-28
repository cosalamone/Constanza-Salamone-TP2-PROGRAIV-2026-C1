export enum REGISTER_MESSAGES {
  LENGTH_ERROR = 'La contraseña debe tener al menos 6 caracteres.',
  CHARACTERS_ERROR = 'La contraseña debe tener al menos una letra minúscula y un número.',
  NUMBER_ERROR = 'La contraseña debe contener al menos un número.',
  SUCCESS = '¡El registro fue exitoso!',
  ALREADY_REGISTERED = 'El correo electrónico ya se encuentra registrado.',
}

export enum REGISTER_ERROR_CODES {
  ALREADY_EXISTS = 'user_already_exists',
  CHARACTERS = 'characters',
}
