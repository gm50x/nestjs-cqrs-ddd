import { Inject, Injectable } from '@nestjs/common';
import {
  AmqpResiliencyModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './amqp-resiliency.options';

@Injectable()
export class AmqpResiliencyService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: AmqpResiliencyModuleOptions,
  ) {}

  onModuleInit() {
    console.log('#'.repeat(100));
    console.log(this.options);
  }
}
