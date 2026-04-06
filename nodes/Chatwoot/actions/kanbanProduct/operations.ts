import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getKanbanBoardId, getKanbanProductId } from '../../shared/transport';
import type { KanbanProductOperation } from './types';

export async function executeKanbanProductOperation(
	context: IExecuteFunctions,
	operation: KanbanProductOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createProduct(context, itemIndex);
		case 'delete':
			return deleteProduct(context, itemIndex);
		case 'list':
			return listProducts(context, itemIndex);
		case 'update':
			return updateProduct(context, itemIndex);
	}
}

async function createProduct(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const boardId = getKanbanBoardId.call(context, itemIndex);
	const name = context.getNodeParameter('name', itemIndex);
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/kanban/boards/${boardId}/products`,
		{ product:
			{
				name,
				...additionalFields,
			}
		},
	) as IDataObject;

	return { json: result };
}

async function listProducts(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const boardId = getKanbanBoardId.call(context, itemIndex);
	const filters = context.getNodeParameter('listFilters', itemIndex, {}) as IDataObject;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/boards/${boardId}/products`,
		undefined,
		filters,
	) as { products?: IDataObject[] } | IDataObject[];

	const products =
		(result as { products?: IDataObject[] }).products ??
		(Array.isArray(result) ? result : []);

	return products.map((product) => ({ json: product }));
}

async function updateProduct(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const boardId = getKanbanBoardId.call(context, itemIndex);
	const productId = getKanbanProductId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateProductFields', itemIndex, {}) as IDataObject;

	const product: IDataObject = {};

	if (updateFields.name !== undefined) product.name = updateFields.name;
	if (updateFields.description !== undefined) product.description = updateFields.description;
	if (updateFields.unit_price !== undefined) product.unit_price = updateFields.unit_price;
	if (updateFields.archived !== undefined) product.archived = updateFields.archived;

	if (Object.keys(product).length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			'At least one field must be provided to update the product',
			{ itemIndex },
		);
	}

	const result = await chatwootApiRequest.call(
		context,
		'PUT',
		`/api/v1/accounts/${accountId}/kanban/boards/${boardId}/products/${productId}`,
		{ product },
	) as IDataObject;

	return { json: result };
}

async function deleteProduct(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const boardId = getKanbanBoardId.call(context, itemIndex);
	const productId = getKanbanProductId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/kanban/boards/${boardId}/products/${productId}`,
	) as IDataObject;

	return { json: {} };
}
