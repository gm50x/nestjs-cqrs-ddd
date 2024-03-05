import { IntegrationEvent } from '@gedai/tactical-design';

export class AccountPasswordChangedEvent extends IntegrationEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
