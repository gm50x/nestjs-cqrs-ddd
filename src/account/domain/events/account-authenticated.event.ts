import { DomainEvent } from '@gedai/core-ddd';

export class AccountAuthenticatedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
