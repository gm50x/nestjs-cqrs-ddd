import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SignUpCommand,
  SignUpResult,
} from '../../../application/commands/sign-up.command';
import {
  SignUpInput,
  SignUpOutput,
} from '../../../application/models/sign-up.model';

@Controller({ version: '1' })
export class SignUpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  async execute(@Body() data: SignUpInput): Promise<SignUpOutput> {
    const result = await this.commandBus.execute<SignUpCommand, SignUpResult>(
      new SignUpCommand(data),
    );
    return result.data;
  }
}
