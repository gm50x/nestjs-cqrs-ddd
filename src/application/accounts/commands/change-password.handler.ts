import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../../infra/repositories/account/account.repository';
import { ChangePasswordCommand } from './change-password.command';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand, void>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const account = await this.accountRepository.findByEmail(command.email);

    if (!account) {
      throw new UnauthorizedException();
    }

    account.changePassword(command.currentPassword, command.newPassword);
    await this.accountRepository.save(account);
    account.commit();
  }
}
