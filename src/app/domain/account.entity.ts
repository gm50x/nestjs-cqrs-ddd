import { UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Email } from './email.value';
import { Password } from './password.value';

export class Account extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: Email,
    readonly password: Password,
    public token?: string,
  ) {
    super();
  }

  authenticate(password: string) {
    if (!this.password.validate(password)) {
      throw new UnauthorizedException();
    }
    this.token = randomUUID();
    return this.token;
  }
}
