import { PaymentGateway } from '../../application/abstractions/payment.gateway';

export class DummyPaymentGateway implements PaymentGateway {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async charge(passengerId: string, amount: number): Promise<void> {
    return Promise.resolve();
  }
}
