import { Repository, RepositoryWriteOptions } from '@gedai/core';
import { Account } from '../../domain/account.entity';

export abstract class AccountRepository implements Repository<Account> {
  abstract findById(id: string): Promise<Account>;
  abstract findAll(): Promise<Account[]>;
  abstract findByEmail(email: string): Promise<Account>;
  abstract create(
    entity: Account,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
  abstract update(
    entity: Account,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
}
