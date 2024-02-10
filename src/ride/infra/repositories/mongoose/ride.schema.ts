import { EntityMongooseSchema } from '@gedai/tactical-domain';
import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RideStatusValues } from '../../../domain/ride-status.value';
@Schema({ _id: false })
export class CoordSchema {
  @Prop()
  lat: number;

  @Prop()
  long: number;
}

@Schema({ versionKey: false, collection: 'Rides' })
export class RideSchema extends EntityMongooseSchema {
  @Prop()
  passengerId: Types.ObjectId;

  @Prop({ required: false })
  driverId?: Types.ObjectId;

  @Prop()
  fare?: number;

  @Prop()
  distance?: number;

  @Prop({ schema: CoordSchema, type: CoordSchema })
  from: CoordSchema;

  @Prop({ schema: CoordSchema, type: CoordSchema })
  to: CoordSchema;

  @Prop({ type: String })
  status: RideStatusValues;

  @Prop()
  date: Date;
}
