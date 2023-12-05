import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountRepositoryModule } from '../infra/repositories/account/repository.module';
import { ChangePasswordHandler } from './commands/change-password.handler';
import { RequestRideHandler } from './commands/request-ride.handler';
import { SignInHandler } from './commands/sign-in.handler';
import { SignUpHandler } from './commands/sign-up.handler';

@Module({
  imports: [CqrsModule, AccountRepositoryModule.forRoot('Mongoose')],
  providers: [
    SignUpHandler,
    SignInHandler,
    ChangePasswordHandler,
    RequestRideHandler,
  ],
  exports: [
    SignUpHandler,
    SignInHandler,
    ChangePasswordHandler,
    RequestRideHandler,
  ],
})
export class ApplicationModule {}
