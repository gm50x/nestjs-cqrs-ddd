import { AggregateRoot } from '@nestjs/cqrs';

export abstract class Entity extends AggregateRoot {
  constructor(protected readonly _id: string) {
    super();
  }
}
