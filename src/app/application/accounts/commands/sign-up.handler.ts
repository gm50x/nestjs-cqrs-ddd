import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../../../infra/repositories/account/account.repository';
import { AccountFactory } from '../factories/account.factory';
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
      throw new UnprocessableEntityException('Account already exist');
    }
    const account = await this.accountFactory.create(
      command.name,
      command.email,
      command.password,
    );
    account.commit();
    return new SignUpResult(account.id);
  }
}
