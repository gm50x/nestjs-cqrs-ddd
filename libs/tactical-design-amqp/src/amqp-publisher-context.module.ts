import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './amqp-publisher-context.module-builder';

@Global()
@Module({})
export class AmqpPublisherContextModule extends ConfigurableModuleClass {}
