import { RegisterUserDto } from './dtos';

export type SignUpForm = RegisterUserDto & {
  confirmPassword: string;
};
