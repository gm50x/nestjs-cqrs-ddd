import { AmqpModule } from '@gedai/amqp';
import { ContextConfig } from '@gedai/common';
import { ContextifyModule } from '@gedai/contextify';
import { AmqpPublisherContextModule } from '@gedai/tactical-design-amqp';
import { MongooseTransactionalModule } from '@gedai/transactional-mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { AmqpConfig, AmqpPublisherConfig } from './config/amqp.config';
import { MongooseConfig } from './config/mongoose.config';
import { PaymentModule } from './payment/payment.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule,
    ContextifyModule.forRootAsync({
      useClass: ContextConfig,
    }),
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    MongooseTransactionalModule.forFeature({}),
    AmqpModule.forRootAsync({ useClass: AmqpConfig }),
    AmqpPublisherContextModule.forFeatureAsync({
      useClass: AmqpPublisherConfig,
    }),
    AccountModule,
    RideModule,
    PaymentModule,
  ],
})
export class AppModule {}
