import { PaymentChargedEvent } from '@gedai/core';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { PaymentFactory } from '../../../application/abstractions/payment.factory';
import { PaymentRepository } from '../../../application/abstractions/payment.repository';
import { Payment } from '../../../domain/payment.entity';

@Injectable()
export class PaymentMongooseFactory implements PaymentFactory {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(
    rideId: string,
    passengerId: string,
    driverId: string,
    amount: number,
    distance: number,
    passengerEmail: string,
    driverEmail: string,
    rideDate: Date,
  ): Promise<Payment> {
    const payment = new Payment(
      new Types.ObjectId().toHexString(),
      rideId,
      passengerId,
      driverId,
      amount,
      distance,
      passengerEmail,
      driverEmail,
      rideDate,
    );
    await this.paymentRepository.create(payment);
    payment.apply(
      new PaymentChargedEvent(
        rideId,
        passengerEmail,
        driverEmail,
        amount,
        rideDate,
      ),
    );
    return this.eventPublisher.mergeObjectContext(payment);
  }
}
