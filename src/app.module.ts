import { AmqpModule } from '@gedai/amqp';
import { createResiliencyPlugin } from '@gedai/amqp-resiliency';
import { AuditModule } from '@gedai/audit';
import { AmqpConfig, ContextConfig, MongooseConfig } from '@gedai/config';
import { ContextifyModule } from '@gedai/contextify';
import { TransactionalPlugin } from '@gedai/transactional';
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
    ContextifyModule.forRootAsync({
      useClass: ContextConfig,
      plugins: [TransactionalPlugin],
    }),
    AuditModule,
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    AmqpModule.forRootAsync({
      useClass: AmqpConfig,
      plugins: [
        createResiliencyPlugin({ name: 'Foo', servicePrefix: 'gummy.bear' }),
      ],
    }),
    AccountModule,
    RideModule,
    PaymentModule,
  ],
})
export class AppModule {}
