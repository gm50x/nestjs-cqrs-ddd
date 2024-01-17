import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../../application/abstractions/payment.gateway';

@Injectable()
export class DummyPaymentGateway implements PaymentGateway {
  constructor(private readonly http: HttpService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async charge(passengerId: string, amount: number): Promise<void> {
    // await this.http.axiosRef.post(
    //   'https://01hg1d15mxthgh0bf62m8rhq5m10-776b64ae3f3024f65491.requestinspector.com',
    //   { passengerId, amount, message: 'Charging Passenger' },
    //   { headers: { yay: 'oh' } },
    // );
    return Promise.resolve();
  }
}
