import { TypeOrmRepository } from '@gedai/core-ddd';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as BaseRepository } from 'typeorm';
import { AccountRepository } from '../../../application/abstractions/account.repository';
import { Account } from '../../../domain/account.entity';
import { AccountTypeOrmSchemaFactory } from './account-schema.factory';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountTypeOrmRepository
  extends TypeOrmRepository<AccountSchema, Account>
  implements AccountRepository
{
  constructor(
    @InjectRepository(AccountSchema)
    protected readonly userModel: BaseRepository<AccountSchema>,
    protected readonly userSchemaFactory: AccountTypeOrmSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
