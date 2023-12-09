import { AmqpModule } from '@gedai/amqp';
import { AuditModule } from '@gedai/audit';
import { TracingModule } from '@gedai/tracing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
    TracingModule,
    AuditModule,
    MongooseModule.forRoot(
      'mongodb://gedai:gedai@localhost:27017/nestjs-cqrs-ddd?authSource=admin',
      { appName: 'dummy-world-service' },
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://gedai:gedai@localhost:5432/gedai',
      applicationName: 'dummy-world-service',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AmqpModule.forRoot({
      url: 'amqp://gedai:gedai@localhost:5672',
      appName: 'dummy-world-service',
      enableEventPropagation: true,
    }),
    AccountModule,
    RideModule,
  ],
})
export class AppModule {}
