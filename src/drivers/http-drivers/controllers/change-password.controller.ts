import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ChangePasswordCommand } from '../../../application/accounts/commands/change-password.command';
import { ChangePasswordRequest } from '../models/change-password.model';

@Controller({ version: '1' })
export class ChangePasswordController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('change-password')
  async execute(@Body() data: ChangePasswordRequest): Promise<void> {
    return await this.commandBus.execute(
      new ChangePasswordCommand(
        data.email,
        data.currentPassword,
        data.newPassword,
      ),
    );
  }
}
