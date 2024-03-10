import { PublisherContext } from '@gedai/tactical-design';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpPublisherContext } from './amqp-publisher-context';
import { AmqpResiliencyController } from './amqp-resiliency.controller';
import {
  AmqpModuleOptions,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './amqp.options';
import { AmqpService } from './amqp.service';
import { ExpiringMessageStrategy } from './strategies/expiring-message.strategy';
import { RetrialStrategy } from './strategies/retrial.strategy';

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
  providers: [
    AmqpService,
    {
      provide: RetrialStrategy,
      // useClass: DelayedMessageStrategy,
      useClass: ExpiringMessageStrategy,
    },
    {
      provide: PublisherContext,
      useClass: AmqpPublisherContext,
    },
  ],
  controllers: [AmqpResiliencyController],
  exports: [MODULE_OPTIONS_TOKEN, AmqpService, PublisherContext],
})
export class AmqpModule extends ConfigurableModuleClass {}
