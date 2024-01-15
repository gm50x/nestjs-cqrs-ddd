import { Repository } from '@gedai/core';
import { Account } from '../../domain/account.entity';

export abstract class AccountRepository implements Repository<Account> {
  abstract findById(id: string): Promise<Account>;
  abstract findAndReplaceById(id: string, entity: Account): Promise<void>;
  abstract findAll(): Promise<Account[]>;
  abstract findByEmail(email: string): Promise<Account>;
  abstract create(entity: Account): Promise<void>;
  abstract update(entity: Account): Promise<void>;
}
