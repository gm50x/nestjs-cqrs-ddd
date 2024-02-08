import { DomainEvent } from '@gedai/tactical-domain';

export class AccountPasswordChangedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
