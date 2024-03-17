import { IntegrationEvent } from '@gedai/tactical-design';
import { Type } from '@nestjs/common';

export function toDottedNotation(value: string) {
  const values = [value[0].toLowerCase()];
  for (let i = 1; i < value.length; i++) {
    const thisCharacter = value[i];
    if (thisCharacter === thisCharacter.toUpperCase()) {
      values.push('.', thisCharacter.toLowerCase());
    } else {
      values.push(thisCharacter);
    }
  }
  return values.join('');
}

export function routingKeyOf(
  event: IntegrationEvent | Type<IntegrationEvent>,
): string {
  const isInstance = event instanceof IntegrationEvent;
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
