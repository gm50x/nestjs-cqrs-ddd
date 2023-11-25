import { CoreEvent } from '@core-ddd/core-event';

export class AccountPasswordChangedEvent extends CoreEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
