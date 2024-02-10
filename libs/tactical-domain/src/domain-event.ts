export abstract class DomainEvent /* NOSONAR */ {}
export abstract class IntegrationEvent /* NOSONAR */ {}

export type AggregateEvent = DomainEvent | IntegrationEvent;
