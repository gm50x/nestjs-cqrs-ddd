export class AccountModel {
  id: string;
  name: string;
  email: string;
  carPlate?: string;
  isDriver: boolean;
}

export abstract class AccountService {
  abstract getById(id: string): Promise<AccountModel>;
}
