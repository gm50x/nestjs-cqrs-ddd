import { MongooseRepository } from '@gedai/core';
import { TracingService } from '@gedai/tracing';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountRepository } from '../../../application/abstractions/account.repository';
import { Account } from '../../../domain/account.entity';
import { AccountMongooseSchemaFactory } from './account-schema.factory';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountMongooseRepository
  extends MongooseRepository<AccountSchema, Account>
  implements AccountRepository
{
  constructor(
    @InjectModel(AccountSchema.name)
    protected readonly userModel: Model<AccountSchema>,
    protected readonly userSchemaFactory: AccountMongooseSchemaFactory,
    protected readonly tracing: TracingService,
  ) {
    super(userModel, userSchemaFactory, tracing);
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
