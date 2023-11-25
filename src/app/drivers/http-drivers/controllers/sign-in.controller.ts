import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignInCommand } from '../../../application/accounts/commands/sign-in.command';
import { SignInRequest, SignInResponse } from '../models/sign-in.model';

@Controller({ version: '1' })
export class SignInController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-in')
  async execute(@Body() data: SignInRequest): Promise<SignInResponse> {
    return await this.commandBus.execute(
      new SignInCommand(data.email, data.password),
    );
  }
}
