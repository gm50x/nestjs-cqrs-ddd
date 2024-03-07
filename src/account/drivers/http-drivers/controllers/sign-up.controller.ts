import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SignUpCommand,
  SignUpResult,
} from '../../../application/commands/sign-up.command';
import {
  SignUpInput,
  SignUpOutput,
} from '../../../application/dtos/sign-up.dto';

@Controller({ version: '1' })
export class SignUpController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  async execute(@Body() data: SignUpInput): Promise<SignUpOutput> {
    const result = await this.commandBus.execute<SignUpCommand, SignUpResult>(
      new SignUpCommand(data),
    );

    this.logger.log({
      message: 'Hello',
      clientSecret: { key: '123', value: '123' },
    });
    return result.data;
  }
}
