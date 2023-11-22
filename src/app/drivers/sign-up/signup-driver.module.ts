import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SignUpModule } from '../../application/sign-up/sign-up.module';
import { SignUpController } from './sign-up.controller';

@Module({
  imports: [CqrsModule, SignUpModule],
  controllers: [SignUpController],
})
export class SignUpDriverModule {}
