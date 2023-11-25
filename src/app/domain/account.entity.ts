import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Email } from './email.value';
import { AccountAuthenticatedEvent } from './events/account-authenticated.event';
import { AccountPasswordChangedEvent } from './events/account-password-changed.event';
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
    this.apply(new AccountPasswordChangedEvent(this.id));
  }

  authenticate(password: string) {
    if (!this.password.validate(password)) {
      throw new UnauthorizedException();
    }
    this.token = randomUUID();
    this.apply(new AccountAuthenticatedEvent(this.id));
    return this.token;
  }
}
