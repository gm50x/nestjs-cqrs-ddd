import { PublisherContext } from '@gedai/tactical-domain';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpPublisherContext } from './amqp-publisher-context';
import {
  AmqpModuleOptions,
  ConfigurableModuleClass,
  InjectionTokens,
  MODULE_OPTIONS_TOKEN,
} from './amqp.options';
import { AmqpService } from './amqp.service';

@Global()
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [MODULE_OPTIONS_TOKEN, InjectionTokens.ExtraOptions],
      useFactory: (
        options: AmqpModuleOptions,
        extras: {
          queues: AmqpModuleOptions['queues'];
          exchanges: AmqpModuleOptions['exchanges'];
        },
      ) => {
        /**
         * Here, we merge the exchanges and queues from Plugins and Exchanges and Queues provided for the AMQP Config
         */
        const noEmpty = <T>(arr: T[]) => arr.filter((val: T) => Boolean(val));
        const queues = noEmpty([].concat(options.queues, extras?.queues));
        const exchanges = noEmpty(
          [].concat(options.exchanges, extras?.exchanges),
        );

        console.log({ queues, exchanges }, 'creating module');
        return {
          uri: options.url,
          exchanges,
          queues,
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
      provide: PublisherContext,
      useClass: AmqpPublisherContext,
    },
  ],
  exports: [MODULE_OPTIONS_TOKEN, AmqpService, PublisherContext],
})
export class AmqpModule extends ConfigurableModuleClass {}
