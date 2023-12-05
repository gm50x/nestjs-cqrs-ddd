import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountFactory } from '../abstractions/account.factory';
import { AccountRepository } from '../abstractions/account.repository';
import { SignUpCommand, SignUpResult } from './sign-up.command';

@CommandHandler(SignUpCommand)
export class SignUpHandler
  implements ICommandHandler<SignUpCommand, SignUpResult>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountFactory: AccountFactory,
  ) {}

  async execute(command: SignUpCommand): Promise<SignUpResult> {
    const existingAccount = await this.accountRepository.findByEmail(
      command.email,
    );
    if (existingAccount) {
      throw new ConflictException();
    }
    const account = await this.accountFactory.create(
      command.name,
      command.email,
      command.password,
      command.carPlate,
    );
    account.commit();
    return new SignUpResult(account.id);
  }
}
