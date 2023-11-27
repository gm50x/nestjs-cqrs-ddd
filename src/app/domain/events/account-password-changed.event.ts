import { CoreEvent } from '@gedai/core-ddd';

export class AccountPasswordChangedEvent extends CoreEvent {
  constructor(readonly accountId: string) {
    super();
  }
}
