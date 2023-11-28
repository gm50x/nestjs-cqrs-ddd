import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AmqpEventPropagator } from './amqp-event.propagator';
import { AmqpConnection, AmqpConnectionOptions } from './amqp.connection';
import { AmqpService } from './amqp.service';

type AmqpModuleOptions = {
  url: string;
  appName?: string;
  heartbeatIntervalInSeconds?: number;
  enableEventPropagation?: boolean;
  // TODO: add asserts here
};

@Global()
@Module({})
export class AmqpModule {
  static forRoot(opts: AmqpModuleOptions): DynamicModule {
    return {
      module: AmqpModule,
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        AmqpConnection,
        AmqpService,
        AmqpEventPropagator,
        {
          provide: 'AMQP_OPTIONS',
          useValue: {
            url: opts.url,
            appName: opts?.appName,
            enableEventPropagation: opts?.enableEventPropagation ?? true,
          } as AmqpConnectionOptions,
        },
      ],
      exports: [AmqpService],
    };
  }

  static forRootAsync() {
    // TODO: implement this async config module
    throw new Error('Not Yet Implemented');
  }
}
