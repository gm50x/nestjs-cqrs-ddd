import { AmqpModule } from '@gedai/amqp';
import { AuditModule } from '@gedai/audit';
import { AmqpConfig, MongooseConfig } from '@gedai/config';
import { TracingModule } from '@gedai/tracing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { PaymentModule } from './payment/payment.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule,
    TracingModule,
    AuditModule,
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    AmqpModule.forRootAsync({ useClass: AmqpConfig }),
    AccountModule,
    RideModule,
    PaymentModule,
  ],
})
export class AppModule {}
