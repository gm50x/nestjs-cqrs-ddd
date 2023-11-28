import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoryModule } from '../../infra/repositories/account/factory/repository.module';
import { ChangePasswordHandler } from './commands/change-password.handler';
import { SignInHandler } from './commands/sign-in.handler';
import { SignUpHandler } from './commands/sign-up.handler';

@Module({
  imports: [CqrsModule, RepositoryModule.forRoot('Mongoose')],
  providers: [SignUpHandler, SignInHandler, ChangePasswordHandler],
  exports: [SignUpHandler, SignInHandler, ChangePasswordHandler],
})
export class AccountsModule {}
