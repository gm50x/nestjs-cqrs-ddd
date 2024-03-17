const singleDefault = 'SingleDefault';

export const getTransactionToken = (
  connectionName?: string,
  databaseProvider?: string,
) =>
  `TransactionManager::${databaseProvider ?? singleDefault}::${connectionName ?? singleDefault}`;

export const TransactionStorageKeyToken = 'TransactionManager::Provider::Name';
