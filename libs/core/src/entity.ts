import { AggregateRoot } from '@nestjs/cqrs';

export abstract class Entity extends AggregateRoot {}
