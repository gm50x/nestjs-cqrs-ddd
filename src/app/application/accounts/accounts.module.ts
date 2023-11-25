import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoryModule } from '../../infra/repositories/repository.module';
import { SignUpHandler } from './commands/sign-up.handler';
import { AccountFactory } from './factories/account.factory';

@Module({
  imports: [CqrsModule, RepositoryModule],
  providers: [SignUpHandler, AccountFactory],
  exports: [SignUpHandler],
})
export class SignUpModule {}
