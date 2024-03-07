import { ConfigurableModuleBuilder, Module, Type } from '@nestjs/common';
import { TransactionManager } from './transaction.manager';

export type TransactionalModuleOptions = object;
export type TransactionalModuleExtraOptions = {
  isGlobal?: boolean;
  TransactionManagerAdapter: Type<TransactionManager>;
};

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<TransactionalModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createTransactionalOptions')
    .setExtras(null, (definitions, extras: TransactionalModuleExtraOptions) => {
      const { TransactionManagerAdapter, isGlobal = true } = extras;
      return {
        ...definitions,
        global: isGlobal,
        providers: [
          ...(definitions.providers || []),
          {
            provide: TransactionManager,
            useClass: TransactionManagerAdapter,
          },
          {
            provide: 'TRANSACTION_ADAPTER_NAME',
            useValue: TransactionManagerAdapter.name,
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
