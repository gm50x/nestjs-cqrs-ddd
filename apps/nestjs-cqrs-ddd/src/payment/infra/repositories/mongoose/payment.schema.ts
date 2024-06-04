import { EntityMongooseSchema } from '@gedai/nestjs-tactical-design-mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'Payments' })
export class PaymentSchema extends EntityMongooseSchema {
  @Prop()
  rideId: Types.ObjectId;

  @Prop()
  passengerId: Types.ObjectId;

  @Prop()
  driverId: Types.ObjectId;

  @Prop()
  amount: number;

  @Prop()
  distance: number;

  @Prop()
  passengerEmail: string;

  @Prop()
  driverEmail: string;

  @Prop()
  rideDate: Date;
}
