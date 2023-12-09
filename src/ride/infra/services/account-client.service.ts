import { Injectable } from '@nestjs/common';
import { AccountClient } from '../../../account/drivers/client/account.client';
import {
  AccountModel,
  AccountService,
} from '../../application/abstractions/account.service';

@Injectable()
export class AccountClientService implements AccountService {
  constructor(private readonly client: AccountClient) {}
  async getById(id: string): Promise<AccountModel> {
    const account = await this.client.getById(id).catch(() => null);
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
