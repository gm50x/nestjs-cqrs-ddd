import { MongooseRepository } from '@gedai/core';
import { TracingService } from '@gedai/tracing';
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
    @InjectModel(PaymentSchema.name)
    protected readonly paymentModel: Model<PaymentSchema>,
    protected readonly paymentSchemaFactory: PaymentMongooseSchemaFactory,
    protected readonly tracing: TracingService,
  ) {
    super(paymentModel, paymentSchemaFactory, tracing);
  }
}
