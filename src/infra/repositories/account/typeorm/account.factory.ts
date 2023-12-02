import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { AccountFactory } from '../../../../application/abstractions/account.factory';
import { AccountRepository } from '../../../../application/abstractions/account.repository';
import { Account } from '../../../../domain/account.entity';
import { Email } from '../../../../domain/email.value';
import { AccountCreatedEvent } from '../../../../domain/events/account-created.event';
import { PasswordFactory } from '../../../../domain/password.value';

@Injectable()
export class AccountTypeOrmFactory implements AccountFactory {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<Account> {
    const Password = PasswordFactory.create('pbkdf2');
    const account = new Account(
      null,
      name,
      new Email(email),
      new Password(password, PasswordFactory.generateSalt(), true),
    );
    await this.accountRepository.create(account);
    account.apply(new AccountCreatedEvent(account.id));
    return this.eventPublisher.mergeObjectContext(account);
  }
}
