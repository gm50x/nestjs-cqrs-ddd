export enum ExchangeNames {
  Error = 'error',
  Delay = 'delay',
}

export enum Suffixes {
  Dead = '.dead',
}

export enum QueueNames {
  Error = 'error',
  Requeue = 'requeue',
  Delay = 'delay',
  Dead = 'retrial.dead',
}

export enum ChannelNames {
  Publisher = 'Publisher',
  ErrorConsumer = 'Error',
  RequeueConsumer = 'Requeue',
}
