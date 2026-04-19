import { INodeExecutionData, NodeOperationError, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, extractResourceLocatorIdAsNumber, getAccountId, getChatwootBaseUrl, getInternalChatChannelId, getInternalChatMessageId } from '../../shared/transport';
import { InternalChatMessageOperation } from './types';

export async function executeInternalChatMessageOperation(
	context: IExecuteFunctions,
	operation: InternalChatMessageOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'list':
			return listMessages(context, itemIndex);
		case 'create':
			return createMessage(context, itemIndex);
		case 'sendFile':
			return sendFileToChannel(context, itemIndex);
		case 'update':
			return updateMessage(context, itemIndex);
		case 'delete':
			return deleteMessage(context, itemIndex);
		case 'pin':
			return pinMessage(context, itemIndex);
		case 'unpin':
			return unpinMessage(context, itemIndex);
		case 'getThread':
			return getThread(context, itemIndex);
		case 'addReaction':
			return addReaction(context, itemIndex);
		case 'removeReaction':
			return removeReaction(context, itemIndex);
		case 'createPoll':
			return createPoll(context, itemIndex);
		case 'vote':
			return votePoll(context, itemIndex);
		case 'removeVote':
			return removeVote(context, itemIndex);
		case 'listDrafts':
			return listDrafts(context, itemIndex);
		case 'saveDraft':
			return saveDraft(context, itemIndex);
		case 'deleteDraft':
			return deleteDraft(context, itemIndex);
	}
}

async function listMessages(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

	const qs: IDataObject = {};
	if (filters.before) qs.before = filters.before;
	if (filters.after) qs.after = filters.after;
	if (filters.around) qs.around = filters.around;

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages`,
		undefined,
		qs,
	) as IDataObject | IDataObject[];

	const messages = Array.isArray(result)
		? result
		: ((result.messages as IDataObject[]) || (result.payload as IDataObject[]) || []);
	return messages.map((message) => ({ json: message }));
}

async function createMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const content = context.getNodeParameter('content', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const body: IDataObject = { content };
	const parentId = extractResourceLocatorIdAsNumber(additionalFields.parent_id);
	if (parentId !== undefined) body.parent_id = parentId;
	if (additionalFields.echo_id) body.echo_id = additionalFields.echo_id;
	if (additionalFields.also_send_in_channel !== undefined) {
		body.also_send_in_channel = additionalFields.also_send_in_channel;
	}

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages`,
		body,
	) as IDataObject;

	return { json: result };
}

async function sendFileToChannel(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const binaryPropertyName = context.getNodeParameter('binaryPropertyName', itemIndex) as string;
	const caption = context.getNodeParameter('fileCaption', itemIndex, '') as string;
	const options = context.getNodeParameter('sendFileOptions', itemIndex, {}) as IDataObject;

	const binaryData = context.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const fileName = binaryData.fileName || 'file';

	const formData: IDataObject = {
		'attachments[0][file]': {
			value: buffer,
			options: {
				filename: fileName,
				contentType: binaryData.mimeType,
			},
		},
	};

	if (options.file_type) {
		formData['attachments[0][file_type]'] = String(options.file_type);
	}
	if (caption) formData.content = caption;
	if (options.echo_id) formData.echo_id = String(options.echo_id);
	if (options.also_send_in_channel) formData.also_send_in_channel = 'true';
	const parentId = extractResourceLocatorIdAsNumber(options.parent_id);
	if (parentId !== undefined) formData.parent_id = String(parentId);

	const baseURL = await getChatwootBaseUrl.call(context);

	const result = await context.helpers.requestWithAuthentication.call(
		context,
		'fazerAiChatwootApi',
		{
			method: 'POST',
			uri: `${baseURL}/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages`,
			formData,
			json: true,
		},
	);

	return { json: result as IDataObject };
}

async function updateMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);
	const content = context.getNodeParameter('content', itemIndex) as string;

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages/${messageId}`,
		{ content },
	) as IDataObject;

	return { json: result };
}

async function deleteMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages/${messageId}`,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function pinMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages/${messageId}/pin`,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function unpinMessage(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages/${messageId}/unpin`,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function getThread(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/messages/${messageId}/thread`,
	) as IDataObject;

	return { json: result };
}

async function addReaction(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);
	const emoji = context.getNodeParameter('emoji', itemIndex) as string;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/messages/${messageId}/reactions`,
		{ emoji },
	) as IDataObject;

	return { json: result };
}

async function removeReaction(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const messageId = getInternalChatMessageId.call(context, itemIndex);
	const reactionId = context.getNodeParameter('reactionId', itemIndex) as number;

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/messages/${messageId}/reactions/${reactionId}`,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function createPoll(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const question = context.getNodeParameter('question', itemIndex) as string;
	const optionsParam = context.getNodeParameter('pollOptions.option', itemIndex, []) as IDataObject[];
	const pollAdditionalFields = context.getNodeParameter('pollAdditionalFields', itemIndex, {}) as IDataObject;

	const options = optionsParam
		.map((option) => {
			const text = typeof option.text === 'string' ? option.text.trim() : '';
			if (!text) return undefined;
			const entry: IDataObject = { text };
			if (option.emoji) entry.emoji = option.emoji;
			if (option.image_url) entry.image_url = option.image_url;
			return entry;
		})
		.filter((entry): entry is IDataObject => entry !== undefined);

	if (options.length < 2) {
		throw new NodeOperationError(
			context.getNode(),
			'A poll requires at least 2 options',
			{ itemIndex },
		);
	}

	const body: IDataObject = {
		channel_id: Number(channelId),
		question,
		options,
	};
	if (pollAdditionalFields.allow_revote !== undefined) body.allow_revote = pollAdditionalFields.allow_revote;
	if (pollAdditionalFields.expires_at) body.expires_at = pollAdditionalFields.expires_at;
	if (pollAdditionalFields.multiple_choice !== undefined) body.multiple_choice = pollAdditionalFields.multiple_choice;
	if (pollAdditionalFields.public_results !== undefined) body.public_results = pollAdditionalFields.public_results;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/polls`,
		body,
	) as IDataObject;

	return { json: result };
}

async function votePoll(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const pollId = context.getNodeParameter('pollId', itemIndex) as number;
	const optionId = context.getNodeParameter('voteOptionId', itemIndex) as number;

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/polls/${pollId}/vote`,
		{ option_id: Number(optionId) },
	) as IDataObject;

	return { json: result };
}

async function removeVote(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const pollId = context.getNodeParameter('pollId', itemIndex) as number;
	const optionId = context.getNodeParameter('removeVoteOptionId', itemIndex, 0) as number;

	const qs: IDataObject = {};
	if (optionId) qs.option_id = Number(optionId);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/polls/${pollId}/vote`,
		undefined,
		qs,
	) as IDataObject;

	return { json: result || { success: true } };
}

async function listDrafts(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/drafts`,
	) as IDataObject | IDataObject[];

	const drafts = Array.isArray(result)
		? result
		: ((result.drafts as IDataObject[]) || (result.payload as IDataObject[]) || []);
	return drafts.map((draft) => ({ json: draft }));
}

async function saveDraft(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const content = context.getNodeParameter('content', itemIndex) as string;
	const parentId = extractResourceLocatorIdAsNumber(context.getNodeParameter('parent_id', itemIndex, ''));

	const body: IDataObject = { content };
	if (parentId !== undefined) body.parent_id = parentId;

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/draft`,
		body,
	) as IDataObject;

	return { json: result };
}

async function deleteDraft(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const parentId = extractResourceLocatorIdAsNumber(context.getNodeParameter('parent_id', itemIndex, ''));

	const qs: IDataObject = {};
	if (parentId !== undefined) qs.parent_id = parentId;

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/draft`,
		undefined,
		qs,
	) as IDataObject;

	return { json: result || { success: true } };
}
