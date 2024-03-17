import { MongooseRepository } from '@gedai/tactical-design-mongoose';
import {
  InjectTransactionManager,
  TransactionManager,
} from '@gedai/transactional';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentRepository } from '../../../application/abstractions/payment.repository';
import { Payment } from '../../../domain/payment.entity';
import { PaymentMongooseSchemaFactory } from './payment-schema.factory';
import { PaymentSchema } from './payment.schema';

@Injectable()
export class PaymentMongooseRepository
  extends MongooseRepository<PaymentSchema, Payment>
  implements PaymentRepository
{
  constructor(
    @InjectTransactionManager()
    protected readonly transactionManager: TransactionManager,
    @InjectModel(PaymentSchema.name)
    protected readonly paymentModel: Model<PaymentSchema>,
    protected readonly paymentSchemaFactory: PaymentMongooseSchemaFactory,
  ) {
    super(transactionManager, paymentModel, paymentSchemaFactory);
  }
}
