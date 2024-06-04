import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { ChangePasswordHandler } from './commands/change-password.handler';
import { SignInHandler } from './commands/sign-in.handler';
import { SignUpHandler } from './commands/sign-up.handler';
import { GetAccountHandler } from './query/get-account.handler';

@Module({
  imports: [CqrsModule, InfraModule],
  providers: [
    SignUpHandler,
    SignInHandler,
    ChangePasswordHandler,
    GetAccountHandler,
  ],
})
export class ApplicationModule {}
