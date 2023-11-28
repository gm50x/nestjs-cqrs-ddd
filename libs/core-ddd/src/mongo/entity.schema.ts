import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class EntityMongoSchema {
  @Prop()
  readonly _id: Types.ObjectId;
}
