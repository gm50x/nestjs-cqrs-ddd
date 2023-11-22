import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { User } from '../../../domain/user.entity';
import { EntitySchemaFactory } from '../core/entity-schema.factory';
import { UserSchema } from './user.schema';

@Injectable()
export class UserSchemaFactory
  implements EntitySchemaFactory<UserSchema, User>
{
  constructor(private readonly eventPublisher: EventPublisher) {}
  create(entity: User): UserSchema {
    return {
      _id: new Types.ObjectId(entity.id),
      name: entity.name,
      email: entity.email,
      password: entity.password,
    };
  }

  createFromSchema(entitySchema: UserSchema): User {
    return this.eventPublisher.mergeObjectContext(
      new User(
        entitySchema._id.toHexString(),
        entitySchema.name,
        entitySchema.email,
        entitySchema.password,
      ),
    );
  }
}
