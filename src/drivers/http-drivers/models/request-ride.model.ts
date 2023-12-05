import { Type } from 'class-transformer';
import { IsDefined, IsString, Max, Min, ValidateNested } from 'class-validator';

export class Coord {
  @Min(-90)
  @Max(90)
  lat: number;

  @Min(-180)
  @Max(180)
  long: number;
}

export class RequestRideRequest {
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

export class RequestRideResponse {
  id: string;
}
