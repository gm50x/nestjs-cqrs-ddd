import { IntegrationEvent } from '@gedai/tactical-domain';

export class AccountPasswordChangedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
