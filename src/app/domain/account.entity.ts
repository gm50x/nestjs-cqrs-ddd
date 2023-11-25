import { AggregateRoot } from '@nestjs/cqrs';
import { Email } from './email.value';
import { Password } from './password.value';

export class Account extends AggregateRoot {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: Email,
    readonly password: Password,
  ) {
    super();
  }
}
