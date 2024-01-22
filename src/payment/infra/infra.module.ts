import { AxiosHttpTracingPropagationConfig } from '@gedai/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { PaymentFactory } from '../application/abstractions/payment.factory';
import { PaymentGateway } from '../application/abstractions/payment.gateway';
import { PaymentRepository } from '../application/abstractions/payment.repository';
import { RideService } from '../application/abstractions/ride.service';
import { DummyPaymentGateway } from './gateways/dummy-payment.gateway';
import { PaymentMongooseSchemaFactory } from './repositories/mongoose/payment-schema.factory';
import { PaymentMongooseFactory } from './repositories/mongoose/payment.factory';
import { PaymentMongooseRepository } from './repositories/mongoose/payment.repository';
import { PaymentSchema } from './repositories/mongoose/payment.schema';
import { InterncalCallRideService } from './services/internal-call-ride.service';

@Module({
  imports: [
    CqrsModule,
    HttpModule.register({}),
    MongooseModule.forFeature([
      {
        name: PaymentSchema.name,
        schema: SchemaFactory.createForClass(PaymentSchema),
      },
    ]),
  ],
  providers: [
    PaymentMongooseSchemaFactory,
    AxiosHttpTracingPropagationConfig,
    {
      provide: PaymentRepository,
      useClass: PaymentMongooseRepository,
    },
    {
      provide: PaymentFactory,
      useClass: PaymentMongooseFactory,
    },
    {
      provide: PaymentGateway,
      useClass: DummyPaymentGateway,
    },
    {
      provide: RideService,
      useClass: InterncalCallRideService,
    },
  ],
  exports: [PaymentRepository, PaymentFactory, PaymentGateway, RideService],
})
export class InfraModule {}
