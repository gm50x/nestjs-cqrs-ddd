import { AsyncContextService } from '@gedai/async-context';
import { MongooseRepository } from '@gedai/tactical-domain-adapter-mongoose';
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
    protected readonly contextService: AsyncContextService,
    @InjectModel(PaymentSchema.name)
    protected readonly paymentModel: Model<PaymentSchema>,
    protected readonly paymentSchemaFactory: PaymentMongooseSchemaFactory,
  ) {
    super(contextService, paymentModel, paymentSchemaFactory);
  }
}
