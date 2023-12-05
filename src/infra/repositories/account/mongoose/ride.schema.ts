import { EntityMongooseSchema } from '@gedai/core-ddd';
import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
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

  @Prop({ schema: CoordSchema, type: CoordSchema })
  from: CoordSchema;

  @Prop({ schema: CoordSchema, type: CoordSchema })
  to: CoordSchema;

  @Prop()
  status: string;

  @Prop()
  date: Date;
}
