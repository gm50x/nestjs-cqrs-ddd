import { Plugin } from '@gedai/async-context';
import { Global, Module } from '@nestjs/common';
import { TransactionManager } from './transaction.manager';

@Global()
@Module({
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class TransactionalModule {}

export const TransactionalPlugin: Plugin = {
  name: 'Transactional',
  imports: [TransactionalModule],
};
