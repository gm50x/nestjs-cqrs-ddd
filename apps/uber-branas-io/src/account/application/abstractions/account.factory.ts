import { EntityFactory } from '@gedai/nestjs-tactical-design';
import { Account } from '../../domain/account.entity';

export abstract class AccountFactory implements EntityFactory<Account> {
  abstract create(
    name: string,
    email: string,
    password: string,
    carPlate?: string,
  ): Promise<Account>;
}
