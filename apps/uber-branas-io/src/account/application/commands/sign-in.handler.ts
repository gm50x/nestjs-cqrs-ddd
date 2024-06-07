import { Transactional } from '@gedai/nestjs-tactical-design';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountRepository } from '../abstractions/account.repository';
import { SignInCommand, SignInResult } from './sign-in.command';

@CommandHandler(SignInCommand)
export class SignInHandler
  implements ICommandHandler<SignInCommand, SignInResult>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  @Transactional()
  async execute({ data }: SignInCommand): Promise<SignInResult> {
    const account = await this.accountRepository.findByEmail(data.email);
    if (!account) {
      throw new UnauthorizedException();
    }
    const token = account.authenticate(data.password);
    await this.accountRepository.update(account);
    token.decrypt(data.password);
    await account.commit();
    return new SignInResult({ access_token: token.value });
  }
}
