import { AggregateRoot } from './aggregate-root';

export abstract class Entity extends AggregateRoot {
  constructor(protected readonly _id: string) {
    super();
  }

  get id() {
    return this._id;
  }
}
