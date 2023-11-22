import { Prop, Schema } from '@nestjs/mongoose';
import { EntitySchema } from '../core/entity.schema';

@Schema({ versionKey: false, collection: 'users' })
export class UserSchema extends EntitySchema {
  @Prop()
  readonly name: string;

  @Prop()
  readonly email: string;

  @Prop()
  readonly password: string;
}
