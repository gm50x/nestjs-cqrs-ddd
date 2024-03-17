import { PublisherContext } from '@gedai/tactical-design';
import { Global, Module } from '@nestjs/common';
import { AmqpPublisherContext } from './amqp-publisher-context';
import { ConfigurableModuleClass } from './amqp-publisher-context.module-builder';

@Global()
@Module({
  providers: [
    {
      provide: PublisherContext,
      useClass: AmqpPublisherContext,
    },
  ],
  exports: [PublisherContext],
})
export class AmqpPublisherContextModule extends ConfigurableModuleClass {}
