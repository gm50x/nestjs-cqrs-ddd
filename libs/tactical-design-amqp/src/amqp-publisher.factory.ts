/**
 * @property {string} eventBusName The exchange to publish events
 */
export type AmqpPublisherContextModuleOptions = {
  eventBusName: string;
  eventBusType?: string;
};

export type AmqpPublisherContextModuleExtraOptions = {
  publisherName: string;
};

export interface AmqpPublisherContextOptionsFactory {
  createAmqpPublisherOptions():
    | AmqpPublisherContextModuleOptions
    | Promise<AmqpPublisherContextModuleOptions>;
}
