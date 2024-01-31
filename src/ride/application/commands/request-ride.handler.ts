import { Transactional } from '@gedai/core';
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

  @Transactional()
  async execute({ data }: RequestRideCommand): Promise<RequestRideResult> {
    const account = await this.accountService.getById(data.passengerId);
    if (!account) {
      throw new UnprocessableEntityException(
        `Account ${data.passengerId} does not exist`,
      );
    }
    const activeRides = await this.rideRepository.getActiveRidesByPassengerId(
      data.passengerId,
    );
    if (activeRides.length > 0) {
      throw new ConflictException(
        `Passenger ${data.passengerId} already has an active ride`,
      );
    }
    const ride = await this.rideFactory.create(
      data.passengerId,
      data.from,
      data.to,
    );
    await ride.commit();
    return new RequestRideResult({ id: ride.id });
  }
}
