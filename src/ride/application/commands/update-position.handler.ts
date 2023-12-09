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

  async execute(command: UpdatePositionCommand): Promise<void> {
    const ride = await this.rideRepository.findOneById(command.rideId);
    if (!ride) {
      throw new UnprocessableEntityException(
        `Ride ${command.rideId} does not exist`,
      );
    }
    const position = await this.positionFactory.create(
      command.rideId,
      command.coord,
    );
    position.commit();
  }
}
