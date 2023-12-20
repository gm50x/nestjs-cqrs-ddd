import { IsString } from 'class-validator';

export class ChangePasswordInput {
  @IsString()
  email: string;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
