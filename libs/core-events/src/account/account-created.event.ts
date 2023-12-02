import { DomainEvent } from '../domain-event';

export class AccountCreatedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
