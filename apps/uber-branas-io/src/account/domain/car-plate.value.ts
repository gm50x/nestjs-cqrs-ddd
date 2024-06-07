export class CarPlate {
  private readonly _value: string;

  constructor(carPlate: string) {
    if (!carPlate?.match(/[A-Z]{3}-\d{4}/)) {
      throw new Error(`Invalid Car Plate: ${carPlate}`);
    }
    this._value = carPlate;
  }

  get value() {
    return this._value;
  }
}
