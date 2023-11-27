import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AccountSchemaFactory } from './account/account-schema.factory';
import { AccountRepository } from './account/account.repository';
import { AccountSchema } from './account/account.schema';

const providedValues = [AccountSchemaFactory, AccountRepository];

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
  providers: providedValues,
  exports: providedValues,
})
export class RepositoryModule {}
