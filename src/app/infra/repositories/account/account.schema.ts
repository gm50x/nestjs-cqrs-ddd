import { EntitySchema } from '@core-ddd/entity.schema';
import { Prop, Schema } from '@nestjs/mongoose';
import { PasswordAlgorithm } from 'src/app/domain/password.value';

@Schema({ _id: false })
export class PasswordSchema {
  @Prop()
  value: string;

  @Prop()
  salt: string;

  @Prop()
  algorithm: PasswordAlgorithm;
}

@Schema({ versionKey: false, collection: 'Accounts' })
export class AccountSchema extends EntitySchema {
  @Prop()
  readonly name: string;

  @Prop()
  readonly email: string;

  @Prop({ schema: PasswordSchema })
  readonly password: PasswordSchema;
}
