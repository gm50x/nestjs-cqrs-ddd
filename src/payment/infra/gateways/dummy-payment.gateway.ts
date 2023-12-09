import { PaymentGateway } from '../../application/abstractions/payment.gateway';

export class DummyPaymentGateway implements PaymentGateway {
  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  async charge(passengerId: string, amount: number): Promise<void> {
    const randomInt = this.getRandomInt(0, 10);
    if (randomInt <= 1) {
      throw new Error(`Operation Timed Out for ${passengerId} and ${amount}`);
    }
  }
}
