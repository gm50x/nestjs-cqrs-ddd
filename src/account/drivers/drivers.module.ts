import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { ChangePasswordController } from './http-drivers/controllers/change-password.controller';
import { SignInController } from './http-drivers/controllers/sign-in.controller';
import { SignUpController } from './http-drivers/controllers/sign-up.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [SignUpController, SignInController, ChangePasswordController],
})
export class DriversModule {}
