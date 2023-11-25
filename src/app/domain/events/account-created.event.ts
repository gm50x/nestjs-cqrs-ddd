import { CoreEvent } from '@core-ddd/core-event';
export class AccountCreatedEvent extends CoreEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
