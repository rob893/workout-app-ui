import { Indexable } from './core';
import { User } from './entities';

export interface UpdateUserDto extends Indexable {
  firstName?: string;
  lastName?: string;
}

export interface RegisterUserDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export type RegisterResponse = LoginResponse;

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}
