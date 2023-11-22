import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../domain/user.entity';
import { Repository } from '../core/repository';
import { UserSchemaFactory } from './user-schema.factory';
import { UserSchema } from './user.schema';

@Injectable()
export class UserRepository extends Repository<UserSchema, User> {
  constructor(
    @InjectModel(UserSchema.name)
    protected readonly userModel: Model<UserSchema>,
    protected readonly userSchemaFactory: UserSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}
