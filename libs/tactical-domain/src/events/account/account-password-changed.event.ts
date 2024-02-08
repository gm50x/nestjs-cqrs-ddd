import { DomainEvent } from '../domain-event';

export class AccountPasswordChangedEvent extends DomainEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
