import { DomainEvent } from '@gedai/tactical-domain';

export class AccountAuthenticatedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
