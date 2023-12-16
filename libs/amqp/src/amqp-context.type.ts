import { ContextType } from '@nestjs/common';

export type AmqpContextType = ContextType & 'rmq';
export const AmqpContextType = 'rmq';
