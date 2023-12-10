export function getRidePositions(rideId: string) {
  // const validRideData = [
  //   [-23.52862, -46.90328], //0
  //   [-23.52651, -46.89962], // 500m
  //   [-23.52693, -46.89689], // 750
  //   [-23.52206, -46.88988], // 1.6Km
  //   [-23.51843, -46.88975], //2.1Km
  //   [-23.51038, -46.88921], //3.0Km
  //   [-23.51066, -46.88215], //3.8Km
  //   [-23.51146, -46.87489], //4.5Km
  // ];
  return {
    data: [
      { rideId, coord: { lat: -23.52862, long: -46.90328 } },
      { rideId, coord: { lat: -23.52651, long: -46.89962 } },
      { rideId, coord: { lat: -23.52693, long: -46.89689 } },
      { rideId, coord: { lat: -23.52206, long: -46.88988 } },
      { rideId, coord: { lat: -23.51843, long: -46.88975 } },
      { rideId, coord: { lat: -23.51038, long: -46.88921 } },
      { rideId, coord: { lat: -23.51066, long: -46.88215 } },
      { rideId, coord: { lat: -23.51146, long: -46.87489 } },
    ],
  };
}

export function getRequestRide(passengerId: string) {
  return {
    passengerId,
    from: getRidePositions('').data.at(0).coord,
    to: getRidePositions('').data.at(-1).coord,
  };
}
