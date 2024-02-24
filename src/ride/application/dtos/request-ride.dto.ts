import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Coord } from './ride.dto';

export class RequestRideInput {
  @IsString()
  passengerId: string;

  @IsDefined()
  @Type(() => Coord)
  @ValidateNested()
  from: Coord;

  @IsDefined()
  @Type(() => Coord)
  @ValidateNested()
  to: Coord;
}

export class RequestRideOutput {
  id: string;
}
