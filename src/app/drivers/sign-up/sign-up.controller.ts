import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../../application/sign-up/commands/sign-up.command';
import { SignUpRequest, SignUpResponse } from './models/sign-up.model';

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
