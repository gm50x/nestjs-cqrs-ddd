import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ChangePasswordHandler } from './application/commands/change-password.handler';
import { SignInHandler } from './application/commands/sign-in.handler';
import { SignUpHandler } from './application/commands/sign-up.handler';
import { ChangePasswordController } from './drivers/http-drivers/controllers/change-password.controller';
import { SignInController } from './drivers/http-drivers/controllers/sign-in.controller';
import { SignUpController } from './drivers/http-drivers/controllers/sign-up.controller';
import { AccountRepositoryModule } from './infra/repositories/account/repository.module';

@Module({
  imports: [CqrsModule, AccountRepositoryModule.forRoot('Mongoose')],
  providers: [SignUpHandler, SignInHandler, ChangePasswordHandler],
  exports: [SignUpHandler, SignInHandler, ChangePasswordHandler],
  controllers: [SignUpController, SignInController, ChangePasswordController],
})
export class AccountModule {}
