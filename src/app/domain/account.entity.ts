import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Email } from './email.value';
import { Password, PasswordFactory } from './password.value';

export class Account extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: Email,
    public password: Password,
    public token?: string,
  ) {
    super();
  }

  changePassword(currentPassword: string, newPassword: string) {
    if (!this.password.validate(currentPassword)) {
      throw new ForbiddenException();
    }
    const Password = PasswordFactory.create('sha256');
    this.password = new Password(
      newPassword,
      PasswordFactory.generateSalt(),
      true,
    );
  }

  authenticate(password: string) {
    if (!this.password.validate(password)) {
      throw new UnauthorizedException();
    }
    this.token = randomUUID();
    return this.token;
  }
}
