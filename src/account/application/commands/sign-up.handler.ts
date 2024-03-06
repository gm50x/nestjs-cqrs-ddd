import { Transactional } from '@gedai/transactional-mongoose';
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

  @Transactional()
  async execute({ data }: SignUpCommand): Promise<SignUpResult> {
    const existingAccount = await this.accountRepository.findByEmail(
      data.email,
    );
    if (existingAccount) {
      throw new ConflictException();
    }
    const account = await this.accountFactory.create(
      data.name,
      data.email,
      data.password,
      data.carPlate,
    );
    await account.commit();
    return new SignUpResult({ id: account.id });
  }
}
