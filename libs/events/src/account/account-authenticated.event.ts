import { IntegrationEvent } from '@gedai/tactical-design';

export class AccountAuthenticatedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
