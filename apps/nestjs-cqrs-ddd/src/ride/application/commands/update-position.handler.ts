import { Transactional } from '@gedai/transactional';
import { UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PositionFactory } from '../abstractions/position.factory';
import { RideRepository } from '../abstractions/ride.repository';
import { UpdatePositionCommand } from './update-position.command';

@CommandHandler(UpdatePositionCommand)
export class UpdatePositionHandler
  implements ICommandHandler<UpdatePositionCommand, void>
{
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionFactory: PositionFactory,
  ) {}

  @Transactional()
  async execute({ data }: UpdatePositionCommand): Promise<void> {
    const ride = await this.rideRepository.findById(data.rideId);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${data.rideId} does not exist`,
      );
    }
    const position = await this.positionFactory.create(data.rideId, data.coord);
    await position.commit();
  }
}
