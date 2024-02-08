import { DomainEvent } from '../domain-event';

export class AccountAuthenticatedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
