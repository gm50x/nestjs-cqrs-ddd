export abstract class PaymentGateway {
  abstract charge(passengerId: string, amount: number): Promise<void>;
}
