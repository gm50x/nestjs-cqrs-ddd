import { Repository } from '@gedai/core';
import { Payment } from '../../domain/payment.entity';

export abstract class PaymentRepository implements Repository<Payment> {
  abstract findById(id: string): Promise<Payment>;
  abstract findAll(): Promise<Payment[]>;
  abstract create(entity: Payment): Promise<void>;
  abstract update(entity: Payment): Promise<void>;
}
