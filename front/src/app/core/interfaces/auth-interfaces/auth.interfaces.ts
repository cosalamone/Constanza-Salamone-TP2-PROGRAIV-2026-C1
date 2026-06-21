export interface IRegister {
  name: string;
  lastName: string;
  username: string;
  birthDate: Date;
  password: string;
  confirmPassword?: string;
  description?: string;
  profileImage?: string;
  role?: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IAuthError {
  message?: string;
  code?: string;
  status?: number;
  reasons?: string[];
}
