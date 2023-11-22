import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { SignUpHandler } from './app/application/commands/sign-up.handler';
import { UserFactory } from './app/domain/user.factory';
import { SignUpController } from './app/infra/controllers/sign-up.controller';
import {
  UserRepository,
  UserSchema,
  UserSchemaFactory,
} from './app/infra/repositories/user.repository';
import { AmqpEventPropagator } from './app/infra/services/amqp-event.propagator';
import { TracingModule } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TracingModule,
    CqrsModule.forRoot(),
    MongooseModule.forRoot('mongodb://gedai:gedai@localhost:27017', {
      appName: 'dummy-world-service',
    }),
    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: SchemaFactory.createForClass(UserSchema),
      },
    ]),
  ],
  controllers: [SignUpController],
  providers: [
    SignUpHandler,
    UserRepository,
    UserFactory,
    UserSchemaFactory,
    AmqpEventPropagator,
  ],
})
export class AppModule {}
