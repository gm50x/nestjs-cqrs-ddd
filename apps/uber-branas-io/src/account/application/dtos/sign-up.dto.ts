import { IsOptional, IsString } from 'class-validator';

export class SignUpInput {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  carPlate: string;
}

export class SignUpOutput {
  id: string;
}
