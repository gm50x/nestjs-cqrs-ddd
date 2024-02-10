import { IntegrationEvent } from '@gedai/tactical-domain';

export class AccountCreatedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
