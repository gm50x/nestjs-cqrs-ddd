import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PaymentGateway } from '../../application/abstractions/payment.gateway';

@Injectable()
export class DummyPaymentGateway implements PaymentGateway {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly http: HttpService) {}

  private takeAChangeOnFailure() {
    if (randomInt(100) < 10) {
      throw new Error('Forced error!');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async charge(passengerId: string, amount: number): Promise<void> {
    this.takeAChangeOnFailure();
    this.logger.log(
      `Passenger ${passengerId} was charged ${amount} with success!`,
    );
    return Promise.resolve();
  }
}
