import { Repository } from '@gedai/core';
import { Payment } from '../../domain/payment.entity';

export abstract class PaymentRepository implements Repository<Payment> {
  abstract findOneById(id: string): Promise<Payment>;
  abstract findOneAndReplaceById(id: string, entity: Payment): Promise<void>;
  abstract findAll(): Promise<Payment[]>;
  abstract create(entity: Payment): Promise<void>;
  abstract save(entity: Payment): Promise<void>;
}
