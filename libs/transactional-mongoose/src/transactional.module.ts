import { Plugin } from '@gedai/contextify';
import { TransactionalModule } from '@gedai/transactional';
import { MongooseTransactionManager } from './mongoose-transaction.manager';

type Options = {
  isGlobal?: boolean;
};

export class MongooseTransactionalModule {
  static forRoot(options?: Options) {
    const { isGlobal = false } = options || {};
    return TransactionalModule.forRoot({
      isGlobal,
      TransactionManagerAdapter: MongooseTransactionManager,
    });
  }
}

export const MongooseTransactionalPlugin: Plugin = {
  name: 'MongooseTransactional',
  imports: [
    MongooseTransactionalModule.forRoot({
      isGlobal: true,
    }),
  ],
};
