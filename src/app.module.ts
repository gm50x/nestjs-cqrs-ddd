import { AmqpModule } from '@gedai/amqp';
import { ContextModule } from '@gedai/async-context';
import { AuditModule } from '@gedai/audit';
import { AmqpConfig, ContextConfig, MongooseConfig } from '@gedai/config';
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
    ContextModule.forRootAsync({ useClass: ContextConfig }),
    AuditModule,
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    AmqpModule.forRootAsync({ useClass: AmqpConfig }),
    AccountModule,
    RideModule,
    PaymentModule,
  ],
})
export class AppModule {}
