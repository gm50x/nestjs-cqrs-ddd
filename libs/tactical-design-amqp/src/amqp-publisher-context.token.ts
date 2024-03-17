const singleDefault = 'SingleDefault';

export const getPublisherToken = (
  publisherName?: string,
  providerName?: string,
) =>
  `PublisherContext::${publisherName ?? singleDefault}::${providerName ?? singleDefault}`;
