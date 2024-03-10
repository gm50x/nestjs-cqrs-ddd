import { EntitySchemaFactory, PublisherContext } from '@gedai/tactical-design';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Payment } from '../../../domain/payment.entity';
import { PaymentSchema } from './payment.schema';

@Injectable()
export class PaymentMongooseSchemaFactory
  implements EntitySchemaFactory<PaymentSchema, Payment>
{
  constructor(private readonly publisherContext: PublisherContext) {}
  create(entity: Payment): PaymentSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      rideId: new Types.ObjectId(entity.rideId),
      passengerId: new Types.ObjectId(entity.passengerId),
      driverId: new Types.ObjectId(entity.driverId),
      amount: entity.amount,
      distance: entity.distance,
      driverEmail: entity.driverEmail,
      passengerEmail: entity.passengerEmail,
      rideDate: entity.rideDate,
    };
  }

  createFromSchema(entitySchema: PaymentSchema): Payment {
    return this.publisherContext.mergeObjectContext(
      new Payment(
        entitySchema._id.toHexString(),
        entitySchema.rideId.toHexString(),
        entitySchema.passengerId.toHexString(),
        entitySchema.driverId.toHexString(),
        entitySchema.amount,
        entitySchema.distance,
        entitySchema.passengerEmail,
        entitySchema.driverEmail,
        entitySchema.rideDate,
      ),
    );
  }
}
