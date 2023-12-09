import { Coord } from './coord.value';

class HaversineDistanceCalculator {
  static calculate(from: Coord, to: Coord) {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;
    const fromLatRad = from.lat * degreesToRadians;
    const fromLongRad = from.long * degreesToRadians;
    const toLatRad = to.lat * degreesToRadians;
    const toLongRad = to.long * degreesToRadians;
    const deltaLat = toLatRad - fromLatRad;
    const deltaLong = toLongRad - fromLongRad;
    // Haversine Formula:
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(from.lat * degreesToRadians) *
        Math.cos(to.lat * degreesToRadians) *
        Math.sin(deltaLong / 2) *
        Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }
}

export class DistanceCalculator {
  static calculate(from: Coord, to: Coord) {
    return HaversineDistanceCalculator.calculate(from, to);
  }
}
