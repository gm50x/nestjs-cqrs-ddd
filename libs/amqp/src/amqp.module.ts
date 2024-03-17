import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpModuleOptions } from './amqp.factory';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './amqp.module-builder';
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
          connectionInitOptions: { wait: false },
          channels: (options.channels ?? []).reduce(
            (acc, { name, ...channelConfig }) => {
              return {
                ...acc,
                [name]: channelConfig,
              };
            },
            {},
          ),
          connectionManagerOptions: {
            reconnectTimeInSeconds: options.reconnectInSeconds ?? 10,
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
  providers: [AmqpService],
  exports: [MODULE_OPTIONS_TOKEN, AmqpService],
})
export class AmqpModule extends ConfigurableModuleClass {}
