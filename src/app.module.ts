import { AmqpModule } from '@gedai/amqp';
import { AuditModule } from '@gedai/audit';
import { TracingModule } from '@gedai/tracing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpDriversModule } from './drivers/http-drivers/http-drivers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
    TracingModule,
    AuditModule,
    MongooseModule.forRoot(
      'mongodb://gedai:gedai@localhost:27017/nestjs-cqrs-ddd?authSource=admin',
      {
        appName: 'dummy-world-service',
        connectTimeoutMS: 1000,
        socketTimeoutMS: 1000,
        waitQueueTimeoutMS: 1000,
        serverSelectionTimeoutMS: 1000,
      },
    ),
    AmqpModule.forRoot('amqp://gedai:gedai@localhost:5672', {
      appName: 'dummy-world-service',
    }),
    HttpDriversModule,
  ],
})
export class AppModule {}
