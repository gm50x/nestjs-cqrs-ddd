import { DomainEvent } from '@gedai/tactical-domain';

export class AccountCreatedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
