import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpEventPropagator } from './amqp-event.propagator';
import { AmqpConnection } from './amqp.connection';
import { ConfigurableModuleClass } from './amqp.options';
import { AmqpService } from './amqp.service';

@Global()
@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [AmqpConnection, AmqpService, AmqpEventPropagator],
  exports: [AmqpService],
})
export class AmqpModule extends ConfigurableModuleClass {}
