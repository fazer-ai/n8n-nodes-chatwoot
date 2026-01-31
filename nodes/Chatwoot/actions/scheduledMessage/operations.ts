import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
	chatwootApiRequest,
	getAccountId,
	getConversationId,
	getScheduledMessageId,
} from '../../shared/transport';
import { ScheduledMessageOperation } from './types';

export async function executeScheduledMessageOperation(
	context: IExecuteFunctions,
	operation: ScheduledMessageOperation,
	itemIndex: number,
): Promise<INodeExecutionData> {
	switch (operation) {
		case 'getAll':
			return getAllScheduledMessages(context, itemIndex);
		case 'create':
			return createScheduledMessage(context, itemIndex);
		case 'update':
			return updateScheduledMessage(context, itemIndex);
		case 'delete':
			return deleteScheduledMessage(context, itemIndex);
	}
}

async function getAllScheduledMessages(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const conversationId = getConversationId.call(context, itemIndex);

	const response = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/scheduled_messages`,
	) as IDataObject;

	const result = (response.payload as IDataObject[]) || response;
	return { json: result as unknown as IDataObject };
}

async function createScheduledMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const conversationId = getConversationId.call(context, itemIndex);

	const content = context.getNodeParameter('content', itemIndex) as string;
	const scheduledAt = context.getNodeParameter('scheduledAt', itemIndex, '') as string;
	const status = context.getNodeParameter('status', itemIndex) as string;

	const body: IDataObject = {
		content,
		status,
	};

	if (scheduledAt) {
		body.scheduled_at = scheduledAt;
	}

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/scheduled_messages`,
		body,
	) as IDataObject;

	return { json: result };
}

async function updateScheduledMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const conversationId = getConversationId.call(context, itemIndex);
	const scheduledMessageId = getScheduledMessageId.call(context, itemIndex);

	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
	const body: IDataObject = {};

	if (updateFields.content) {
		body.content = updateFields.content;
	}
	if (updateFields.scheduled_at) {
		body.scheduled_at = updateFields.scheduled_at;
	}
	if (updateFields.status) {
		body.status = updateFields.status;
	}

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/scheduled_messages/${scheduledMessageId}`,
		body,
	) as IDataObject;

	return { json: result };
}

async function deleteScheduledMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const conversationId = getConversationId.call(context, itemIndex);
	const scheduledMessageId = getScheduledMessageId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/scheduled_messages/${scheduledMessageId}`,
	) as IDataObject;

	return { json: result };
}
