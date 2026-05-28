export interface IRegister {
  name: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IAuthError {
  message?: string;
  code?: string;
  status?: number;
  reasons?: string[];
}
