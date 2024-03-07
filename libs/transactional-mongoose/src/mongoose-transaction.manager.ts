import { ContextifyService } from '@gedai/contextify';
import { Transaction, TransactionManager } from '@gedai/transactional';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

class MongooseTransaction extends Transaction<ClientSession> {
  async begin(): Promise<void> {
    this._hostTransaction.startTransaction();
  }

  async commit(): Promise<void> {
    await this._hostTransaction.commitTransaction();
  }

  async rollback(): Promise<void> {
    await this._hostTransaction.abortTransaction();
  }

  async end(): Promise<void> {
    await this._hostTransaction.endSession();
  }
}

@Injectable()
export class MongooseTransactionManager extends TransactionManager {
  constructor(
    protected readonly context: ContextifyService,
    @InjectConnection() protected readonly connection: Connection,
  ) {
    super(context);
  }

  async createTransaction(): Promise<Transaction> {
    const session = await this.connection.startSession();
    return new MongooseTransaction(session);
  }
}
