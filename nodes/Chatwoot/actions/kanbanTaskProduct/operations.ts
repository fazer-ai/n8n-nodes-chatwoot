import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getKanbanTaskId, getKanbanTaskProductId, getKanbanProductId } from '../../shared/transport';
import type { KanbanTaskProductOperation } from './types';

export async function executeKanbanTaskProductOperation(
	context: IExecuteFunctions,
	operation: KanbanTaskProductOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createTaskProduct(context, itemIndex);
		case 'delete':
			return deleteTaskProduct(context, itemIndex);
		case 'list':
			return listTaskProducts(context, itemIndex);
		case 'update':
			return updateTaskProduct(context, itemIndex);
	}
}

async function createTaskProduct(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);
	const productId = getKanbanProductId.call(context, itemIndex);
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}/products`,
		{
			task_product: {
				product_id: productId,
				...additionalFields,
			},
		},
	) as IDataObject;

	return { json: result };
}

async function listTaskProducts(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}/products`,
	) as { task_products?: IDataObject[] } | IDataObject[];

	const taskProducts =
		(result as { task_products?: IDataObject[] }).task_products ??
		(Array.isArray(result) ? result : []);

	return taskProducts.map((tp) => ({ json: tp }));
}

async function updateTaskProduct(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);
	const taskProductId = getKanbanTaskProductId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	if (Object.keys(updateFields).length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			'At least one field must be provided to update the task product',
			{ itemIndex },
		);
	}

	const result = await chatwootApiRequest.call(
		context,
		'PUT',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}/products/${taskProductId}`,
		{
			task_product: { ...updateFields },
		},
	) as IDataObject;

	return { json: result };
}

async function deleteTaskProduct(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);
	const taskProductId = getKanbanTaskProductId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}/products/${taskProductId}`,
	);

	return { json: {} };
}
