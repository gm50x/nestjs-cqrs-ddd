import { Transactional } from '@gedai/tactical-domain';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentFactory } from '../abstractions/payment.factory';
import { PaymentGateway } from '../abstractions/payment.gateway';
import { RideService } from '../abstractions/ride.service';
import { ProcessPaymentCommand } from './process-payment.command';

@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler
  implements ICommandHandler<ProcessPaymentCommand, void>
{
  constructor(
    private readonly rideService: RideService,
    private readonly paymentFactory: PaymentFactory,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  @Transactional()
  async execute({ data }: ProcessPaymentCommand): Promise<void> {
    const ride = await this.rideService.getById(data.rideId);
    await this.paymentGateway.charge(ride.passenger.id, ride.fare);
    // TODO: consider failures
    const payment = await this.paymentFactory.create(
      ride.id,
      ride.passenger.id,
      ride.driver.id,
      ride.fare,
      ride.distance,
      ride.passenger.email,
      ride.driver.email,
      ride.date,
    );
    await payment.commit();
  }
}
