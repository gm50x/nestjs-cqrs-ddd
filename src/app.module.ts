import { AmqpModule } from '@amqp';
import { AuditModule } from '@audit';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TracingModule } from '@tracing';
import { HttpDriversModule } from './app/drivers/http-drivers/http-drivers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
    TracingModule,
    AuditModule,
    MongooseModule.forRoot('mongodb://gedai:gedai@localhost:27017', {
      appName: 'dummy-world-service',
    }),
    AmqpModule.forRoot('amqp://gedai:gedai@localhost:5672', {
      appName: 'dummy-world-service',
    }),
    HttpDriversModule,
  ],
})
export class AppModule {}
