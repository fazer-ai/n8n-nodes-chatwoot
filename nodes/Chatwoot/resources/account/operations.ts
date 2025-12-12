import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId } from '../../shared/transport';
import { AccountOperation } from './types';

export async function executeAccountOperation(
	context: IExecuteFunctions,
	operation: AccountOperation,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
  case 'get':
    return getAccount(context, itemIndex);
  }
}

async function getAccount(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const accountId = getAccountId.call(context, itemIndex);

	return (await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}`,
	)) as IDataObject;
}
