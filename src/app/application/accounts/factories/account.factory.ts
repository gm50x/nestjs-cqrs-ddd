import { EntityFactory } from '@core-ddd/entity.factory';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { Account } from '../../../domain/account.entity';
import { Email } from '../../../domain/email.value';
import { AccountCreatedEvent } from '../../../domain/events/account-created.event';
import { PasswordFactory } from '../../../domain/password.value';
import { AccountRepository } from '../../../infra/repositories/account/account.repository';

@Injectable()
export class AccountFactory implements EntityFactory<Account> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<Account> {
    const Password = PasswordFactory.create('sha256');
    const account = new Account(
      new Types.ObjectId().toHexString(),
      name,
      new Email(email),
      new Password(password, randomBytes(36).toString('hex')),
    );
    await this.accountRepository.create(account);
    account.apply(new AccountCreatedEvent(account.id));
    return this.eventPublisher.mergeObjectContext(account);
  }
}
