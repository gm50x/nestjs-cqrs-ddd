import { PublisherContext } from '@gedai/tactical-design';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpPublisherContext } from './amqp-publisher-context';
import { AmqpModuleOptions } from './amqp.factory';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './amqp.options';
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
  providers: [
    AmqpService,
    {
      provide: PublisherContext,
      useClass: AmqpPublisherContext,
    },
  ],
  exports: [MODULE_OPTIONS_TOKEN, AmqpService, PublisherContext],
})
export class AmqpModule extends ConfigurableModuleClass {}
