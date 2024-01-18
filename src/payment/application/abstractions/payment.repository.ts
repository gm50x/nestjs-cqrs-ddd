import { Repository, RepositoryWriteOptions } from '@gedai/core';
import { Payment } from '../../domain/payment.entity';

export abstract class PaymentRepository implements Repository<Payment> {
  abstract findById(id: string): Promise<Payment>;
  abstract findAll(): Promise<Payment[]>;
  abstract create(
    entity: Payment,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
  abstract update(
    entity: Payment,
    options?: RepositoryWriteOptions,
  ): Promise<void>;
}
