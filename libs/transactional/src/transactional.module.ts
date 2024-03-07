import { ConfigurableModuleBuilder, Module, Type } from '@nestjs/common';
import { TransactionManager } from './transaction.manager';

export type TransactionalModuleOptions = object;
export type TransactionalModuleExtraOptions = {
  TransactionManagerAdapter: Type<TransactionManager>;
};

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<TransactionalModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createTransactionalOptions')
    .setExtras(null, (definitions, extras: TransactionalModuleExtraOptions) => {
      return {
        ...definitions,
        providers: [
          ...(definitions.providers || []),
          {
            provide: TransactionManager,
            useClass: extras.TransactionManagerAdapter,
          },
        ],
        exports: [...(definitions.exports || []), TransactionManager],
      };
    })
    .build();

@Module({
  imports: [],
  providers: [],
  exports: [MODULE_OPTIONS_TOKEN],
})
export class TransactionalModule extends ConfigurableModuleClass {}
