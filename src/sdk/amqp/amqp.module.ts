import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpEventPropagator } from './amqp-event.propagator';
import { AmqpConnection } from './amqp.connection';
import { AmqpService } from './amqp.service';

// TODO: this must work dynamically
// TODO: should allow asserting exchanges and queues on setup
@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [AmqpConnection, AmqpService, AmqpEventPropagator],
  exports: [AmqpService],
})
export class AmqpModule {}
