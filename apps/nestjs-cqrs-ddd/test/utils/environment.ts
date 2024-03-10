import { randomUUID } from 'crypto';

const basicBearer = `gedai:gedai`;
export const virtualHost = randomUUID().split('-').at(0);
export const rabbitmqURL = `http://${basicBearer}@localhost:15672`;

export const env = {
  MONGO_URL: `mongodb://${basicBearer}@localhost:27017/${virtualHost}?authSource=admin`,
  AMQP_URL: `amqp://${basicBearer}@localhost:5672/${virtualHost}`,
  NODE_ENV: 'testing',
  APP_NAME: 'test-nestjs-cqrs-ddd',
  AMQP_EXCHANGE_EVENT_ROOT: 'events',
};
