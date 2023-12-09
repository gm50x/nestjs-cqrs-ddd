import { Global, Module } from '@nestjs/common';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpEventPropagator } from './amqp-event.propagator';
import {
  AmqpModuleOptions,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './amqp.options';
import { AmqpService } from './amqp.service';

@Global()
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: AmqpModuleOptions) => {
        return {
          uri: options.url,
          exchanges: options.exchanges ?? [],
          queues: options.queues ?? [],
          enableControllerDiscovery: true,
          connectionInitOptions: { wait: true },
          connectionManagerOptions: {
            heartbeatIntervalInSeconds:
              options.heartbeatIntervalInSeconds ?? 60,
            connectionOptions: {
              clientProperties: { connection_name: options.appName },
            },
          },
        };
      },
    }),
  ],
  providers: [AmqpService, AmqpEventPropagator],
  exports: [AmqpService, MODULE_OPTIONS_TOKEN],
})
export class AmqpModule extends ConfigurableModuleClass {}
