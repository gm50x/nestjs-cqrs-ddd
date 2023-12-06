import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountRepositoryModule } from '../infra/repositories/account/repository.module';
import { AcceptRideHandler } from './commands/accept-ride.handler';
import { ChangePasswordHandler } from './commands/change-password.handler';
import { FinishRideHandler } from './commands/finish-ride.handler';
import { GetRideHandler } from './commands/get-ride.handler';
import { RequestRideHandler } from './commands/request-ride.handler';
import { SignInHandler } from './commands/sign-in.handler';
import { SignUpHandler } from './commands/sign-up.handler';
import { StartRideHandler } from './commands/start-ride.handler';
import { UpdatePositionHandler } from './commands/update-position.handler';

@Module({
  imports: [CqrsModule, AccountRepositoryModule.forRoot('Mongoose')],
  providers: [
    SignUpHandler,
    SignInHandler,
    ChangePasswordHandler,
    RequestRideHandler,
    AcceptRideHandler,
    StartRideHandler,
    UpdatePositionHandler,
    FinishRideHandler,
    GetRideHandler,
  ],
})
export class ApplicationModule {}
