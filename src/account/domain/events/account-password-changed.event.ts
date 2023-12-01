import { DomainEvent } from '@gedai/core-ddd';

export class AccountPasswordChangedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
