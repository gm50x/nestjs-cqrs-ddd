import { IsString } from 'class-validator';

export class SignInInput {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class SignInOutput {
  access_token: string;
}
