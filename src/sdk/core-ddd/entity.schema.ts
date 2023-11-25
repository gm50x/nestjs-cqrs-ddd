import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class EntitySchema {
  @Prop()
  readonly _id: Types.ObjectId;
}
