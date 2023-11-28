import { EntitySchemaFactory } from '@gedai/core-ddd';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Account } from '../../../../domain/account.entity';
import { Email } from '../../../../domain/email.value';
import { PasswordFactory } from '../../../../domain/password.value';
import { TokenFactory } from '../../../../domain/token.value';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountTypeOrmSchemaFactory
  implements EntitySchemaFactory<AccountSchema, Account>
{
  constructor(private readonly eventPublisher: EventPublisher) {}
  create(entity: Account): AccountSchema {
    return {
      _id: entity.id ? parseInt(entity.id) : null,
      name: entity.name,
      email: entity.email.value,
      passwordAlgorithm: entity.password.algorithm,
      passwordSalt: entity.password.salt,
      passwordValue: entity.password.value,
      tokenAlgorithm: entity.token?.algorithm,
      tokenMeta: entity.token?.meta,
      tokenValue: entity.token?.getValue(),
    };
  }

  createFromSchema(entitySchema: AccountSchema): Account {
    const Password = PasswordFactory.create(entitySchema.passwordAlgorithm);
    const Token = entitySchema.tokenValue
      ? TokenFactory.create(entitySchema.tokenAlgorithm)
      : null;
    const token = Token
      ? new Token(entitySchema.tokenValue, entitySchema.tokenMeta)
      : null;
    return this.eventPublisher.mergeObjectContext(
      new Account(
        entitySchema._id.toString(),
        entitySchema.name,
        new Email(entitySchema.email),
        new Password(
          entitySchema.passwordValue,
          entitySchema.passwordSalt,
          false,
        ),
        token,
      ),
    );
  }
}
