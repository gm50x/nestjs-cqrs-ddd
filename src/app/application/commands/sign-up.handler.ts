import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserFactory } from '../../domain/user.factory';
import { UserRepository } from '../../infra/repositories/user.repository';
import { SignUpCommand, SignUpResult } from './sign-up.command';

@CommandHandler(SignUpCommand)
export class SignUpHandler
  implements ICommandHandler<SignUpCommand, SignUpResult>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(command: SignUpCommand): Promise<SignUpResult> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new UnprocessableEntityException('User already exist');
    }
    const user = await this.userFactory.create(
      command.name,
      command.email,
      command.password,
    );

    user.commit();
    return new SignUpResult(user.id);
  }
}
