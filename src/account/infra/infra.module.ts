import { TransactionalModule } from '@gedai/transactional';
import { MongooseTransactionManager } from '@gedai/transactional-mongoose';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountFactory } from '../application/abstractions/account.factory';
import { AccountRepository } from '../application/abstractions/account.repository';
import { AccountMongooseSchemaFactory } from './repositories/mongoose/account-schema.factory';
import { AccountMongooseFactory } from './repositories/mongoose/account.factory';
import { AccountMongooseRepository } from './repositories/mongoose/account.repository';
import { AccountSchema } from './repositories/mongoose/account.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: AccountSchema.name,
        schema: SchemaFactory.createForClass(AccountSchema),
      },
    ]),
    TransactionalModule.forRoot({
      TransactionManagerAdapter: MongooseTransactionManager,
    }),
  ],
  providers: [
    AccountMongooseSchemaFactory,
    {
      provide: AccountFactory,
      useClass: AccountMongooseFactory,
    },
    {
      provide: AccountRepository,
      useClass: AccountMongooseRepository,
    },
  ],
  exports: [AccountFactory, AccountRepository],
})
export class InfraModule {}
