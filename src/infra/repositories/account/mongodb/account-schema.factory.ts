import { EntitySchemaFactory } from '@gedai/core-ddd';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { Account } from '../../../../domain/account.entity';
import { Email } from '../../../../domain/email.value';
import { PasswordFactory } from '../../../../domain/password.value';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountMongoSchemaFactory
  implements EntitySchemaFactory<AccountSchema, Account>
{
  constructor(private readonly eventPublisher: EventPublisher) {}
  create(entity: Account): AccountSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      name: entity.name,
      email: entity.email.value,
      password: entity.password,
      token: entity.token,
    };
  }

  createFromSchema(entitySchema: AccountSchema): Account {
    const Password = PasswordFactory.create(entitySchema.password.algorithm);
    return this.eventPublisher.mergeObjectContext(
      new Account(
        entitySchema._id.toHexString(),
        entitySchema.name,
        new Email(entitySchema.email),
        new Password(
          entitySchema.password.value,
          entitySchema.password.salt,
          false,
        ),
        entitySchema.token,
      ),
    );
  }
}
