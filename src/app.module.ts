import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { SignUpDriverModule } from './app/drivers/sign-up/signup-driver.module';
import { TracingModule } from './config';
import { AmqpModule } from './sdk/amqp';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
    TracingModule,
    MongooseModule.forRoot('mongodb://gedai:gedai@localhost:27017', {
      appName: 'dummy-world-service',
    }),
    AmqpModule,
    SignUpDriverModule,
  ],
  providers: [],
})
export class AppModule {}
