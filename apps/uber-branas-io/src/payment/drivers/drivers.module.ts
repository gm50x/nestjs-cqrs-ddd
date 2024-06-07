import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { ProcessPaymentController } from './message-drivers/process-payment.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [ProcessPaymentController],
})
export class DriversModule {}
