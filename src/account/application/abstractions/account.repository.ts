import { Repository } from '@gedai/tactical-domain';
import { Account } from '../../domain/account.entity';

export abstract class AccountRepository implements Repository<Account> {
  abstract findById(id: string): Promise<Account>;
  abstract findAll(): Promise<Account[]>;
  abstract findByEmail(email: string): Promise<Account>;
  abstract create(entity: Account): Promise<void>;
  abstract update(entity: Account): Promise<void>;
}
