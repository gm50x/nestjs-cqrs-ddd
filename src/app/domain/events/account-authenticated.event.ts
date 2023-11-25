import { CoreEvent } from '@core-ddd/core-event';

export class AccountAuthenticatedEvent extends CoreEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
