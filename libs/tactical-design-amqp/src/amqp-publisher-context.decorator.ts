import { PublisherContext } from '@gedai/tactical-design';
import { Inject } from '@nestjs/common';
import { getPublisherToken } from './amqp-publisher-context.token';

export const InjectPublisherContext = (
  publisherName?: string,
  providerName?: string,
) => Inject(PublisherContext ?? getPublisherToken(publisherName, providerName));
