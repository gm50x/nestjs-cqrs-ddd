import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ChangePasswordCommand } from '../../../application/commands/change-password.command';
import { ChangePasswordInput } from '../../../application/models/change-password.model';

@Controller({ version: '1' })
export class ChangePasswordController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('change-password')
  async execute(@Body() data: ChangePasswordInput): Promise<void> {
    return await this.commandBus.execute(
      new ChangePasswordCommand({
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    );
  }
}
