import { TransactionalModule } from '@gedai/transactional';
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MongooseTransactionManager } from './mongoose-transaction.manager';

export type TransactionalMongooseOptions = object;
export type TransactionalMongooseExtrasOptions = {
  connectionName?: string;
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<TransactionalMongooseOptions>()
    .setClassMethodName('forFeature')
    .setFactoryMethodName('createTransactionalOptions')
    .setExtras<TransactionalMongooseExtrasOptions>(
      null,
      (definitions, extras) => {
        const { connectionName } = extras;
        return {
          ...definitions,
          global: true,
          imports: [
            ...(definitions.imports || []),
            TransactionalModule.forFeature({
              connectionName,
              TransactionManagerAdapter:
                MongooseTransactionManager(connectionName),
            }),
          ],
        };
      },
    )
    .build();
