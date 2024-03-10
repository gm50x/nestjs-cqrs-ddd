import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAccountQuery } from '../../../account/application/query/get-account.query';
import {
  AccountModel,
  AccountService,
} from '../../application/abstractions/account.service';

@Injectable()
export class InternalCallAccountService implements AccountService {
  constructor(private readonly queryBus: QueryBus) {}
  async getById(id: string): Promise<AccountModel> {
    const account = await this.queryBus
      .execute(new GetAccountQuery(id))
      .catch((): AccountModel => null);
    if (!account) {
      return;
    }
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      carPlate: account.carPlate,
      isDriver: account.isDriver,
    };
  }
}
