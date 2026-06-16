export enum REGISTER_MESSAGES {
  LENGTH_ERROR = 'La contraseña debe tener al menos 8 caracteres.',
  CHARACTERS_ERROR = 'La contraseña debe tener al menos una mayúscula y un número.',
  NUMBER_ERROR = 'La contraseña debe contener al menos un número.',
  SUCCESS = '¡El registro fue exitoso!',
  ALREADY_REGISTERED = 'El correo electrónico o nombre de usuario ya se encuentra registrado.',
  PASSWORD_MISMATCH = 'Las contraseñas no coinciden.',
}

export enum REGISTER_ERROR_CODES {
  ALREADY_EXISTS = 'user_already_exists',
  CHARACTERS = 'characters',
}
