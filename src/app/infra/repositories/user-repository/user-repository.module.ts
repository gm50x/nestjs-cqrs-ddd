import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { UserSchemaFactory } from './user-schema.factory';
import { UserRepository } from './user.repository';
import { UserSchema } from './user.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: SchemaFactory.createForClass(UserSchema),
      },
    ]),
  ],
  providers: [UserSchemaFactory, UserRepository],
  exports: [UserSchemaFactory, UserRepository],
})
export class UserRepositoryModule {}
