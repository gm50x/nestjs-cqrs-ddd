import { ProcessPaymentInput } from '../models/process-payment.models';

export class ProcessPaymentCommand {
  constructor(readonly data: ProcessPaymentInput) {}
}
