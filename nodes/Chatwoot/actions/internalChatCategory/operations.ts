import { INodeExecutionData, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getInternalChatCategoryId } from '../../shared/transport';
import { InternalChatCategoryOperation } from './types';

export async function executeInternalChatCategoryOperation(
	context: IExecuteFunctions,
	operation: InternalChatCategoryOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createCategory(context, itemIndex);
		case 'list':
			return listCategories(context, itemIndex);
		case 'update':
			return updateCategory(context, itemIndex);
		case 'delete':
			return deleteCategory(context, itemIndex);
	}
}

async function createCategory(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const name = context.getNodeParameter('name', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/categories`,
		{ category: { name, ...additionalFields } },
	) as IDataObject;

	return { json: result };
}

async function listCategories(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/categories`,
	) as IDataObject | IDataObject[];

	const categories = Array.isArray(result) ? result : ((result.payload as IDataObject[]) || []);
	return categories.map((category) => ({ json: category }));
}

async function updateCategory(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const categoryId = getInternalChatCategoryId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/internal_chat/categories/${categoryId}`,
		{ category: updateFields },
	) as IDataObject;

	return { json: result };
}

async function deleteCategory(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const categoryId = getInternalChatCategoryId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/categories/${categoryId}`,
	) as IDataObject;

	return { json: result || { success: true } };
}
