import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getInboxId } from '../../shared/transport';

export async function executeInboxOperation(
  context: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[] | undefined> {
  if (operation === 'list') {
    return listInboxes(context, itemIndex);
  } else if (operation === 'get') {
    return getInbox(context, itemIndex);
  } else {
    return undefined;
  }
}

async function listInboxes(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const accountId = getAccountId.call(context, itemIndex);

	const response = (await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/inboxes`,
	)) as IDataObject;

	return (response.payload as IDataObject[]) || response;
}

async function getInbox(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const accountId = getAccountId.call(context, itemIndex);
	const inboxId = getInboxId.call(context, itemIndex);

	return (await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/inboxes/${inboxId}`,
	)) as IDataObject;
}

