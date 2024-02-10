import { IntegrationEvent } from '@gedai/tactical-domain';

export class AccountAuthenticatedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
