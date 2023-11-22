import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserFactory } from 'src/app/domain/user.factory';
import { UserRepositoryModule } from '../../infra/repositories/user-repository/user-repository.module';
import { SignUpHandler } from './commands/sign-up.handler';

@Module({
  imports: [CqrsModule, UserRepositoryModule],
  providers: [SignUpHandler, UserFactory],
  exports: [SignUpHandler],
})
export class SignUpModule {}
