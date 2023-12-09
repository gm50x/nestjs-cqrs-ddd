import { Repository } from '@gedai/core';
import { Account } from '../../domain/account.entity';

export abstract class AccountRepository implements Repository<Account> {
  abstract findOneById(id: string): Promise<Account>;
  abstract findOneAndReplaceById(id: string, entity: Account): Promise<void>;
  abstract findAll(): Promise<Account[]>;
  abstract create(entity: Account): Promise<void>;
  abstract save(entity: Account): Promise<void>;
  abstract findByEmail(email: string): Promise<Account>;
}
