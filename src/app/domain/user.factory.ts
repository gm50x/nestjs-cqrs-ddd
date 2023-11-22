import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { EntityFactory } from '../infra/repositories/core/entity.factory';
import { UserRepository } from '../infra/repositories/user-repository/user.repository';
import { UserCreatedEvent } from './user-created.event';
import { User } from './user.entity';

@Injectable()
export class UserFactory implements EntityFactory<User> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(name: string, email: string, password: string): Promise<User> {
    const user = new User(
      new Types.ObjectId().toHexString(),
      name,
      email,
      password,
    );
    await this.usersRepository.create(user);
    user.apply(new UserCreatedEvent(user.id));
    return this.eventPublisher.mergeObjectContext(user);
  }
}
