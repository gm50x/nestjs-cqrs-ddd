import { Plugin } from '@gedai/contextify';
import { TransactionalModule } from '@gedai/transactional';
import { MongooseTransactionManager } from './mongoose-transaction.manager';

export const MongooseTransactionalPlugin: Plugin = {
  name: 'Transactional',
  imports: [
    TransactionalModule.forRoot({
      TransactionManagerAdapter: MongooseTransactionManager,
    }),
  ],
};

// @Module({
//   imports: [
//     TransactionalModule.forRoot({
//       // TODO: why are we needing to cast this?
//       TransactionManagerAdapter: MongooseTransactionManager as any,
//     }),
//   ],
//   providers: [
//     {
//       provide:
//     }
//   ],
//   exports: [TransactionManager],
// })
// export class MongooseTransactionPlugin {}
