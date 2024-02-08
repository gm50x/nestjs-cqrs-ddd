import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SignInCommand,
  SignInResult,
} from '../../../application/commands/sign-in.command';
import {
  SignInInput,
  SignInOutput,
} from '../../../application/models/sign-in.model';

@Controller({ version: '1' })
export class SignInController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-in')
  async execute(@Body() data: SignInInput): Promise<SignInOutput> {
    const result = await this.commandBus.execute<SignInCommand, SignInResult>(
      new SignInCommand(data),
    );
    return result.data;
  }
}
