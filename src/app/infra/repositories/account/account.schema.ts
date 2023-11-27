import { EntitySchema } from '@gedai/core-ddd';
import { Prop, Schema } from '@nestjs/mongoose';
import { PasswordAlgorithm } from 'src/app/domain/password.value';
import { Token, TokenAlgorithm } from 'src/app/domain/token.value';

@Schema({ _id: false })
export class PasswordSchema {
  @Prop()
  value: string;

  @Prop()
  salt: string;

  @Prop({ type: String })
  algorithm: PasswordAlgorithm;
}

@Schema({ _id: false })
export class TokenSchema {
  @Prop()
  value: string;

  @Prop()
  meta: string;

  @Prop({ type: String })
  algorithm: TokenAlgorithm;
}

@Schema({ versionKey: false, collection: 'Accounts' })
export class AccountSchema extends EntitySchema {
  @Prop()
  readonly name: string;

  @Prop()
  readonly email: string;

  @Prop({ schema: PasswordSchema, type: PasswordSchema })
  readonly password: PasswordSchema;

  @Prop({ schema: TokenSchema, type: TokenSchema })
  readonly token?: Token;
}
