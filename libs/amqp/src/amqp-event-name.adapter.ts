import { DomainEvent } from '@gedai/tactical-domain';
import { Type } from '@nestjs/common';

export class AmqpEventNameAdapter {
  static getRoutingKey(event: DomainEvent | Type<DomainEvent>): string {
    const isInstance = event instanceof DomainEvent;
    const eventName = isInstance ? event.constructor.name : event.name;
    const baseNameWithoutSuffix = eventName.replace(/Event$/g, '');
    const values = [baseNameWithoutSuffix[0].toLowerCase()];
    for (let i = 1; i < baseNameWithoutSuffix.length; i++) {
      const thisCharacter = baseNameWithoutSuffix[i];
      if (thisCharacter === thisCharacter.toUpperCase()) {
        values.push('.', thisCharacter.toLowerCase());
      } else {
        values.push(thisCharacter);
      }
    }
    return values.join('');
  }
}
