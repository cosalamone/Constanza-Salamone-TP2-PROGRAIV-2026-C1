export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  username: string;
  birthDate: string;
  description?: string;
  profileImage?: string;
  role: string;
  disabled: boolean;
}

export interface ICreateUserRequest {
  name: string;
  lastName: string;
  username: string;
  password: string;
  birthDate: string;
  description?: string;
  role?: string;
  profileImage?: string;
}
