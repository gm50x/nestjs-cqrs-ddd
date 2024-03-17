import { AccountCreatedEvent } from '@gedai/strategic-design';
import { PublisherContext } from '@gedai/tactical-design';
import { InjectPublisherContext } from '@gedai/tactical-design-amqp';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AccountFactory } from '../../../application/abstractions/account.factory';
import { AccountRepository } from '../../../application/abstractions/account.repository';
import { Account } from '../../../domain/account.entity';
import { CarPlate } from '../../../domain/car-plate.value';
import { Email } from '../../../domain/email.value';
import { PasswordFactory } from '../../../domain/password.value';

@Injectable()
export class AccountMongooseFactory implements AccountFactory {
  constructor(
    private readonly accountRepository: AccountRepository,
    @InjectPublisherContext()
    private readonly publisherContext: PublisherContext,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
    carPlate?: string,
  ): Promise<Account> {
    const Password = PasswordFactory.create('pbkdf2');
    const account = new Account(
      new Types.ObjectId().toHexString(),
      name,
      new Email(email),
      new Password(password, PasswordFactory.generateSalt(), true),
      carPlate ? new CarPlate(carPlate) : null,
    );
    await this.accountRepository.create(account);
    account.apply(new AccountCreatedEvent(account.id));
    return this.publisherContext.mergeObjectContext(account);
  }
}
