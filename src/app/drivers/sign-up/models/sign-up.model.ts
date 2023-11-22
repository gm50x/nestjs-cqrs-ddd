import { IsString } from 'class-validator';

export class SignUpRequest {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class SignUpResponse {
  id: string;
}
