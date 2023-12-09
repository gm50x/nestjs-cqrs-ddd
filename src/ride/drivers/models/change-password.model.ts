import { IsString } from 'class-validator';

export class ChangePasswordRequest {
  @IsString()
  email: string;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
