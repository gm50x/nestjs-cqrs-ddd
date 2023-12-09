import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../abstractions/account.repository';
import { SignInCommand, SignInResult } from './sign-in.command';

@CommandHandler(SignInCommand)
export class SignInHandler
  implements ICommandHandler<SignInCommand, SignInResult>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(command: SignInCommand): Promise<SignInResult> {
    const account = await this.accountRepository.findByEmail(command.email);

    if (!account) {
      throw new UnauthorizedException();
    }
    const token = account.authenticate(command.password);
    await this.accountRepository.save(account);
    token.decrypt(command.password);
    account.commit();
    return new SignInResult(token.value);
  }
}