import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Email } from './email.value';
import { AccountAuthenticatedEvent } from './events/account-authenticated.event';
import { AccountPasswordChangedEvent } from './events/account-password-changed.event';
import { Password, PasswordFactory } from './password.value';
import { Token, TokenFactory } from './token.value';

export class Account extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: Email,
    public password: Password,
    public token?: Token,
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
    const Token = TokenFactory.create('aes-256-gcm');
    this.token = new Token();
    this.token.encrypt(password);
    this.apply(new AccountAuthenticatedEvent(this.id));
    return this.token;
  }
}
