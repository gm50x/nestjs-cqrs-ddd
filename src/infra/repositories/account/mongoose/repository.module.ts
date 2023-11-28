import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountFactory } from '../../../../application/accounts/abstractions/account.factory';
import { AccountRepository } from '../../../../application/accounts/abstractions/account.repository';
import { AccountMongooseSchemaFactory } from './account-schema.factory';
import { AccountMongooseFactory } from './account.factory';
import { AccountMongooseRepository } from './account.repository';
import { AccountSchema } from './account.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: AccountSchema.name,
        schema: SchemaFactory.createForClass(AccountSchema),
      },
    ]),
  ],
  providers: [
    AccountMongooseSchemaFactory,
    {
      provide: AccountRepository,
      useClass: AccountMongooseRepository,
    },
    {
      provide: AccountFactory,
      useClass: AccountMongooseFactory,
    },
    {
      provide: AccountRepository,
      useClass: AccountMongooseRepository,
    },
  ],
  exports: [AccountRepository, AccountFactory],
})
export class MongooseRepositoryModule {}
