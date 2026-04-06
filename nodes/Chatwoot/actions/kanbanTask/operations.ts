import { type IDataObject, type IExecuteFunctions, type INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getKanbanBoardId, getKanbanStepId, getKanbanTaskId } from '../../shared/transport';
import type { KanbanTaskOperation } from './types';

function parseTaskCustomAttributes(
	context: IExecuteFunctions,
	itemIndex: number,
	paramSuffix: string = '',
): IDataObject | undefined {
	const specifyParamName = paramSuffix ? `specifyCustomAttributes${paramSuffix}` : 'specifyCustomAttributes';
	const specifyMode = context.getNodeParameter(specifyParamName, itemIndex, 'none') as string;

	if (specifyMode === 'none') {
		return undefined;
	}

	if (specifyMode === 'definition') {
		const definitionParamName = paramSuffix ? `customAttributesDefinition${paramSuffix}.attributes` : 'customAttributesDefinition.attributes';
		const attributes = context.getNodeParameter(
			definitionParamName,
			itemIndex,
			[],
		) as Array<{ key: string; value: string }>;

		const customAttributes: IDataObject = {};
		for (const attr of attributes) {
			if (attr.key) {
				customAttributes[attr.key] = attr.value;
			}
		}
		return Object.keys(customAttributes).length > 0 ? customAttributes : undefined;
	}

	if (specifyMode === 'keypair') {
		const keypairParamName = paramSuffix ? `customAttributesParameters${paramSuffix}.attributes` : 'customAttributesParameters.attributes';
		const attributes = context.getNodeParameter(
			keypairParamName,
			itemIndex,
			[],
		) as Array<{ name: string; value: string }>;

		const customAttributes: IDataObject = {};
		for (const attr of attributes) {
			if (attr.name) {
				customAttributes[attr.name] = attr.value;
			}
		}
		return Object.keys(customAttributes).length > 0 ? customAttributes : undefined;
	}

	if (specifyMode === 'json') {
		const jsonParamName = paramSuffix ? `customAttributesJson${paramSuffix}` : 'customAttributesJson';
		const jsonValue = context.getNodeParameter(jsonParamName, itemIndex, '{}') as string;
		const parsed = JSON.parse(jsonValue) as unknown;
		if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
			throw new NodeOperationError(
				context.getNode(),
				'Custom attributes JSON must be an object',
				{ itemIndex },
			);
		}
		const customAttributes = parsed as IDataObject;
		return Object.keys(customAttributes).length > 0 ? customAttributes : undefined;
	}

	return undefined;
}

export async function executeKanbanTaskOperation(
	context: IExecuteFunctions,
	operation: KanbanTaskOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createTask(context, itemIndex);
		case 'delete':
			return deleteTask(context, itemIndex);
		case 'get':
			return getTask(context, itemIndex);
		case 'list':
			return listTasks(context, itemIndex);
		case 'move':
			return moveTask(context, itemIndex);
		case 'update':
			return updateTask(context, itemIndex);
	}
}

async function createTask(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const boardId = getKanbanBoardId.call(context, itemIndex);
	const stepId = getKanbanStepId.call(context, itemIndex);
	const title = context.getNodeParameter('title', itemIndex);
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	if (additionalFields.priority === 'none') {
		additionalFields.priority = null;
	}

	const customAttributes = parseTaskCustomAttributes(context, itemIndex, 'Create');

	const task: IDataObject = {
		title,
		board_id: boardId,
		board_step_id: stepId,
		...additionalFields,
		...(customAttributes ? { custom_attributes: customAttributes } : {}),
	};

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/kanban/tasks`,
		{ task },
	) as IDataObject;

	return { json: result };
}

async function getTask(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}`,
	) as IDataObject;

	return { json: result };
}

async function listTasks(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const boardId = getKanbanBoardId.call(context, itemIndex);
	const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/tasks`,
		undefined,
		{
			board_id: boardId,
			...filters
		},
	) as IDataObject;

	return { json: result };
}

async function updateTask(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	if (updateFields.priority === 'none') {
		updateFields.priority = null;
	}

	// Normalize resourceLocator value for board_step_id
	if (updateFields.board_step_id != null && typeof updateFields.board_step_id === 'object') {
		updateFields.board_step_id = (updateFields.board_step_id as IDataObject).value;
	}

	const customAttributes = parseTaskCustomAttributes(context, itemIndex, 'Update');

	const task: IDataObject = {
		...updateFields,
		...(customAttributes ? { custom_attributes: customAttributes } : {}),
	};

	if (Object.keys(task).length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			'At least one field must be provided to update the task',
			{ itemIndex },
		);
	}

	const result = await chatwootApiRequest.call(
		context,
		'PUT',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}`,
		{ task },
	) as IDataObject;

	return { json: result };
}

async function moveTask(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);
	const stepId = getKanbanStepId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}/move`,
		{ board_step_id: stepId, insert_before_task_id: null },
	) as IDataObject;

	return { json: result };
}

async function deleteTask(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const taskId = getKanbanTaskId.call(context, itemIndex);

	await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/kanban/tasks/${taskId}`,
	);

	return { json: {} };
}
