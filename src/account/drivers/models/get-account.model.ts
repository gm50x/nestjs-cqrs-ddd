import { GetAccountOutput } from 'src/account/application/query/get-account.query';

export class GetAccountRequest {
  id: string;
}

export class GetAccountResponse extends GetAccountOutput {}
