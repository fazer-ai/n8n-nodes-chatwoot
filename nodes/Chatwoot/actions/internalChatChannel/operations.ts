import { INodeExecutionData, NodeOperationError, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, extractResourceLocatorIdAsNumber, getAccountId, getInternalChatChannelId, getInternalChatMessageId } from '../../shared/transport';
import { InternalChatChannelOperation } from './types';

export async function executeInternalChatChannelOperation(
	context: IExecuteFunctions,
	operation: InternalChatChannelOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createChannel(context, itemIndex);
		case 'get':
			return getChannel(context, itemIndex);
		case 'list':
			return listChannels(context, itemIndex);
		case 'update':
			return updateChannel(context, itemIndex);
		case 'delete':
			return deleteChannel(context, itemIndex);
		case 'archive':
			return archiveChannel(context, itemIndex);
		case 'unarchive':
			return unarchiveChannel(context, itemIndex);
		case 'markRead':
			return markRead(context, itemIndex);
		case 'markUnread':
			return markUnread(context, itemIndex);
		case 'toggleTyping':
			return toggleTyping(context, itemIndex);
		case 'search':
			return searchInternalChat(context, itemIndex);
	}
}

async function createChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelType = context.getNodeParameter('channelType', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const channel: IDataObject = { channel_type: channelType };

	if (channelType === 'dm') {
		const dmMemberId = context.getNodeParameter('dmMemberId', itemIndex, '') as number | string;
		if (dmMemberId === '' || dmMemberId === null || dmMemberId === undefined) {
			throw new NodeOperationError(
				context.getNode(),
				'A recipient is required to create a DM',
				{ itemIndex },
			);
		}
		const numericId = Number(dmMemberId);
		if (!Number.isInteger(numericId) || numericId <= 0) {
			throw new NodeOperationError(
				context.getNode(),
				`Invalid recipient ID: ${dmMemberId}`,
				{ itemIndex },
			);
		}
		channel.member_ids = [numericId];
	} else {
		channel.name = context.getNodeParameter('name', itemIndex) as string;

		if (channelType === 'private_channel') {
			const memberIds = context.getNodeParameter('memberIds', itemIndex, []) as number[];
			const teamIds = context.getNodeParameter('teamIds', itemIndex, []) as number[];
			if (memberIds.length) channel.member_ids = memberIds;
			if (teamIds.length) channel.team_ids = teamIds;
		}
	}

	if (additionalFields.description !== undefined && additionalFields.description !== '') {
		channel.description = additionalFields.description;
	}
	const categoryId = extractResourceLocatorIdAsNumber(additionalFields.category_id);
	if (categoryId !== undefined) channel.category_id = categoryId;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels`,
		{ channel },
	) as IDataObject;

	return { json: result };
}


async function getChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}`,
	) as IDataObject;

	return { json: result };
}

async function listChannels(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

	const qs: IDataObject = {};
	if (filters.type) qs.type = filters.type;
	if (filters.status) qs.status = filters.status;
	const categoryId = extractResourceLocatorIdAsNumber(filters.category_id);
	if (categoryId !== undefined) qs.category_id = categoryId;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/channels`,
		undefined,
		qs,
	) as IDataObject | IDataObject[];

	const channels = Array.isArray(result) ? result : ((result.payload as IDataObject[]) || []);
	return channels.map((channel) => ({ json: channel }));
}

async function updateChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const channel: IDataObject = {};
	for (const [key, value] of Object.entries(updateFields)) {
		if (value === undefined) continue;
		if (key === 'category_id') {
			channel.category_id = extractResourceLocatorIdAsNumber(value) ?? null;
		} else {
			channel[key] = value;
		}
	}

	if (!Object.keys(channel).length) {
		throw new NodeOperationError(
			context.getNode(),
			'At least one field must be provided to update a channel',
			{ itemIndex },
		);
	}

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}`,
		{ channel },
	) as IDataObject;

	return { json: result };
}

async function deleteChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}`,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function archiveChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/archive`,
	) as IDataObject;

	return { json: result };
}

async function unarchiveChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/unarchive`,
	) as IDataObject;

	return { json: result };
}

async function markRead(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/mark_read`,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function markUnread(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/mark_unread`,
		{ message_id: Number(messageId) },
	) as IDataObject;

	return { json: result || { success: true } };
}

async function toggleTyping(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const typingStatus = context.getNodeParameter('typingStatus', itemIndex) as string;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/toggle_typing_status`,
		{ typing_status: typingStatus },
	) as IDataObject;

	return { json: result || { success: true } };
}

async function searchInternalChat(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const query = context.getNodeParameter('query', itemIndex) as string;
	const page = context.getNodeParameter('page', itemIndex, 1) as number;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/search`,
		undefined,
		{ q: query, page },
	) as IDataObject;

	return { json: result };
}
