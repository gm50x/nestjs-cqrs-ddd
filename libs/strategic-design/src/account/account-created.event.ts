import { IntegrationEvent } from '@gedai/tactical-design';

export class AccountCreatedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
