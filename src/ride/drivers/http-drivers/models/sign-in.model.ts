import { IsString } from 'class-validator';

export class SignInRequest {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class SignInResponse {
  access_token: string;
}
