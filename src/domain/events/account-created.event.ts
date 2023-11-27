import { DomainEvent } from '@gedai/core-ddd';
export class AccountCreatedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
