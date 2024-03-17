import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './mongoose-transactional.options';

@Module({})
export class MongooseTransactionalModule extends ConfigurableModuleClass {}
