export class CarPlate {
  private readonly state: string;

  constructor(carPlate: string) {
    if (!carPlate?.match(/[A-Z]{3}-\d{4}/)) {
      throw new Error(`Invalid Car Plate: ${carPlate}`);
    }
    this.state = carPlate;
  }

  get value() {
    return this.state;
  }
}
