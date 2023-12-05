export class Coord {
  readonly lat: number;
  readonly long: number;

  constructor(lat: number, long: number) {
    if (lat < -90 || lat > 90) {
      throw new Error('Invalid Latitude');
    }
    if (long < -180 || long > 180) {
      throw new Error('Invalid Longitude');
    }
    this.lat = lat;
    this.long = long;
  }
}
