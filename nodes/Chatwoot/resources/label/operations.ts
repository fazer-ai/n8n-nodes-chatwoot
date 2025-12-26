import { NodeApiError, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getLabelId } from '../../shared/transport';
import { LabelOperation } from './types';

export async function executeLabelOperation(
	context: IExecuteFunctions,
	operation: LabelOperation,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return createLabel(context, itemIndex);
    case 'list':
      return listLabels(context, itemIndex);
    case 'update':
      return updateLabel(context, itemIndex);
    case 'delete':
      return deleteLabel(context, itemIndex);
  }
}

async function createLabel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const accountId = getAccountId.call(context, itemIndex);

	const title = context.getNodeParameter('title', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex) as IDataObject;

	const body: IDataObject = {
		title,
		...additionalFields,
	};

	return (await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/labels`,
		body,
	)) as IDataObject;
}

async function listLabels(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const accountId = getAccountId.call(context, itemIndex);

	return (await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/labels`,
	)) as IDataObject;

}

async function updateLabel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const accountId = getAccountId.call(context, itemIndex);
	const labelId = getLabelId.call(context, itemIndex);

	const body: IDataObject = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	throw new NodeApiError(context.getNode(), {
		message: JSON.stringify(body),
	}, { itemIndex });

	return (await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/labels/${labelId}`,
		body,
	)) as IDataObject;
}

async function deleteLabel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const accountId = getAccountId.call(context, itemIndex);
	const labelId = getLabelId.call(context, itemIndex);

	return (await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/labels/${labelId}`,
	)) as IDataObject;
}
