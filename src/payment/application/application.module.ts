import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { ProcessPaymentHandler } from './commands/process-payment.handler';

@Module({
  imports: [CqrsModule, InfraModule],
  providers: [ProcessPaymentHandler],
})
export class ApplicationModule {}
