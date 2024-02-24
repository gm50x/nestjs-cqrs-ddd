import { ProcessPaymentInput } from '../dtos/process-payment.dto';

export class ProcessPaymentCommand {
  constructor(readonly data: ProcessPaymentInput) {}
}
