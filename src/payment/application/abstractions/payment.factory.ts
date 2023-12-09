import { EntityFactory } from '@gedai/core';
import { Payment } from '../../domain/payment.entity';

export abstract class PaymentFactory implements EntityFactory<Payment> {
  abstract create(
    rideId: string,
    passengerId: string,
    driverId: string,
    amount: number,
    distance: number,
    passengerEmail: string,
    driverEmail: string,
    rideDate: Date,
  ): Promise<Payment>;
}
