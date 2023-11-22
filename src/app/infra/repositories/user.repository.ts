import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../domain/user.entity';
import { EntitySchema, EntitySchemaFactory, Repository } from './repository';

@Schema({ versionKey: false, collection: 'users' })
export class UserSchema extends EntitySchema {
  @Prop()
  readonly name: string;

  @Prop()
  readonly email: string;

  @Prop()
  readonly password: string;
}

@Injectable()
export class UserSchemaFactory
  implements EntitySchemaFactory<UserSchema, User>
{
  create(entity: User): UserSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      name: entity.name,
      email: entity.email,
      password: entity.password,
    };
  }

  createFromSchema(entitySchema: UserSchema): User {
    return new User(
      entitySchema._id.toHexString(),
      entitySchema.name,
      entitySchema.email,
      entitySchema.password,
    );
  }
}

@Injectable()
export class UserRepository extends Repository<UserSchema, User> {
  constructor(
    @InjectModel(UserSchema.name) userModel: Model<UserSchema>,
    userSchemaFactory: UserSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
