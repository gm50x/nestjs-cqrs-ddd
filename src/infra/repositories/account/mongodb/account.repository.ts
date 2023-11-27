import { MongoRepository } from '@gedai/core-ddd';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountRepository } from '../../../../application/accounts/abstractions/account.repository';
import { Account } from '../../../../domain/account.entity';
import { AccountMongoSchemaFactory } from './account-schema.factory';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountMongoRepository
  extends MongoRepository<AccountSchema, Account>
  implements AccountRepository
{
  constructor(
    @InjectModel(AccountSchema.name)
    protected readonly userModel: Model<AccountSchema>,
    protected readonly userSchemaFactory: AccountMongoSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
