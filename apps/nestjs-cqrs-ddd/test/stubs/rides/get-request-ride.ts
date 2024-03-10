import { getRidePositions } from './get-ride-positions';

export function getRequestRide(passengerId: string) {
  return {
    passengerId,
    from: getRidePositions('').data.at(0).coord,
    to: getRidePositions('').data.at(-1).coord,
  };
}
