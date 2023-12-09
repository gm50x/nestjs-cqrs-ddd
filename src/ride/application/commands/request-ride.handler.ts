import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountService } from '../abstractions/account.service';
import { RideFactory } from '../abstractions/ride.factory';
import { RideRepository } from '../abstractions/ride.repository';
import { RequestRideCommand, RequestRideResult } from './request-ride.command';

@CommandHandler(RequestRideCommand)
export class RequestRideHandler
  implements ICommandHandler<RequestRideCommand, RequestRideResult>
{
  constructor(
    private readonly accountService: AccountService,
    private readonly rideRepository: RideRepository,
    private readonly rideFactory: RideFactory,
  ) {}

  async execute(command: RequestRideCommand): Promise<RequestRideResult> {
    const account = await this.accountService.getById(command.passengerId);
    if (!account) {
      throw new UnprocessableEntityException(
        `Account ${command.passengerId} does not exist`,
      );
    }
    const activeRides = await this.rideRepository.getActiveRidesByPassengerId(
      command.passengerId,
    );
    if (activeRides.length > 0) {
      throw new ConflictException(
        `Passenger ${command.passengerId} already has an active ride`,
      );
    }
    const ride = await this.rideFactory.create(
      command.passengerId,
      command.from,
      command.to,
    );
    ride.commit();
    return new RequestRideResult(ride.id);
  }
}
