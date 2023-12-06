import { EntityMongooseSchema } from '@gedai/core-ddd';
import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CoordSchema } from './ride.schema';

@Schema({ versionKey: false, collection: 'Positions' })
export class PositionSchema extends EntityMongooseSchema {
  @Prop()
  readonly rideId: Types.ObjectId;

  @Prop({ schema: CoordSchema, type: CoordSchema })
  readonly coord: CoordSchema;

  @Prop()
  timestamp: Date;
}
