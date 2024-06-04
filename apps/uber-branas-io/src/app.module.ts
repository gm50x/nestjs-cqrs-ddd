import { AmqpModule } from '@gedai/nestjs-amqp';
import { CommonConfigModule } from '@gedai/nestjs-common';
import { ContextModule } from '@gedai/nestjs-core';
import { AmqpPublisherContextModule } from '@gedai/nestjs-tactical-design-amqp';
import { MongooseTransactionalModule } from '@gedai/nestjs-tactical-design-mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { AmqpConfig, AmqpPublisherConfig } from './config/amqp.config';
import { AppConfig } from './config/app.config';
import { MongooseConfig } from './config/mongoose.config';
import { PaymentModule } from './payment/payment.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule,
    ContextModule.forRoot({}),
    CommonConfigModule.forRootAsync({ useClass: AppConfig }),
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
