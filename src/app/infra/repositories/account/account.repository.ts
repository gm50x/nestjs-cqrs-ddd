import { Repository } from '@core-ddd/repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../../../domain/account.entity';
import { AccountSchemaFactory } from './account-schema.factory';
import { AccountSchema } from './account.schema';

@Injectable()
export class AccountRepository extends Repository<AccountSchema, Account> {
  constructor(
    @InjectModel(AccountSchema.name)
    protected readonly userModel: Model<AccountSchema>,
    protected readonly userSchemaFactory: AccountSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
