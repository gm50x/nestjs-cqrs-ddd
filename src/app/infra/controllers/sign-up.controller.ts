import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IsString } from 'class-validator';
import { SignUpCommand } from '../../application/commands/sign-up.command';

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

@Controller({ version: '1' })
export class SignUpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  async execute(@Body() data: SignUpRequest): Promise<SignUpResponse> {
    return await this.commandBus.execute(
      new SignUpCommand(data.name, data.email, data.password),
    );
  }
}
