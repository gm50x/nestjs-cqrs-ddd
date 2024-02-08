import { Transactional } from '@gedai/tactical-domain-adapter-mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../abstractions/account.repository';
import { ChangePasswordCommand } from './change-password.command';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand, void>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute({ data }: ChangePasswordCommand): Promise<void> {
    const account = await this.accountRepository.findByEmail(data.email);

    if (!account) {
      throw new UnauthorizedException();
    }

    account.changePassword(data.currentPassword, data.newPassword);
    await this.accountRepository.update(account);
    await account.commit();
  }
}
