import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class EntityMongooseSchema {
  @Prop()
  readonly _id: Types.ObjectId;
}
