import { EntitySchemaFactory, PublisherContext } from '@gedai/tactical-design';
import { InjectPublisherContext } from '@gedai/tactical-design-amqp';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Account } from '../../../domain/account.entity';
import { CarPlate } from '../../../domain/car-plate.value';
import { Email } from '../../../domain/email.value';
import { PasswordFactory } from '../../../domain/password.value';
import { TokenFactory } from '../../../domain/token.value';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountMongooseSchemaFactory
  implements EntitySchemaFactory<AccountSchema, Account>
{
  constructor(
    @InjectPublisherContext()
    private readonly publisherContext: PublisherContext,
  ) {}

  create(entity: Account): AccountSchema {
    const token = entity.token
      ? {
          algorithm: entity.token.algorithm,
          meta: entity.token.meta,
          value: entity.token.value,
        }
      : null;
    return {
      _id: new Types.ObjectId(entity.id),
      name: entity.name,
      email: entity.email.value,
      password: entity.password,
      token: token,
      carPlate: entity.carPlate?.value,
    };
  }

  createFromSchema(entitySchema: AccountSchema): Account {
    const Password = PasswordFactory.create(entitySchema.password.algorithm);
    const Token = entitySchema.token
      ? TokenFactory.create(entitySchema.token.algorithm)
      : null;
    const token = Token
      ? new Token(entitySchema.token.value, entitySchema.token.meta)
      : null;
    const carPlate = entitySchema.carPlate
      ? new CarPlate(entitySchema.carPlate)
      : null;
    return this.publisherContext.mergeObjectContext(
      new Account(
        entitySchema._id.toHexString(),
        entitySchema.name,
        new Email(entitySchema.email),
        new Password(
          entitySchema.password.value,
          entitySchema.password.salt,
          false,
        ),
        carPlate,
        token,
      ),
    );
  }
}
