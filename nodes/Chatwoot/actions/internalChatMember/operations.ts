import { INodeExecutionData, NodeOperationError, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getInternalChatChannelId, getInternalChatMemberId } from '../../shared/transport';
import { InternalChatMemberOperation } from './types';

export async function executeInternalChatMemberOperation(
	context: IExecuteFunctions,
	operation: InternalChatMemberOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
	switch (operation) {
		case 'list':
			return listMembers(context, itemIndex);
		case 'add':
			return addMembers(context, itemIndex);
		case 'update':
			return updateMember(context, itemIndex);
		case 'remove':
			return removeMember(context, itemIndex);
	}
}

async function listMembers(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/members`,
	) as IDataObject | IDataObject[];

	const members = Array.isArray(result) ? result : ((result.payload as IDataObject[]) || []);
	return members.map((member) => ({ json: member }));
}

async function addMembers(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const userIds = context.getNodeParameter('userIds', itemIndex, []) as number[];
	const role = context.getNodeParameter('role', itemIndex, 'member') as string;

	if (!userIds.length) {
		throw new NodeOperationError(
			context.getNode(),
			'At least one user ID is required to add channel members',
			{ itemIndex },
		);
	}

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/members`,
		{ user_ids: userIds, role },
	) as IDataObject;

	return { json: result };
}

async function updateMember(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const memberId = getInternalChatMemberId.call(context, itemIndex);
	const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const body = Object.fromEntries(
		Object.entries(updateFields).filter(([, value]) => value !== undefined),
	);

	if (!Object.keys(body).length) {
		throw new NodeOperationError(
			context.getNode(),
			'At least one field must be provided to update a member',
			{ itemIndex },
		);
	}

	const result = await chatwootApiRequest.call(
		context,
		'PATCH',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/members/${memberId}`,
		body,
	) as IDataObject;

	return { json: result };
}

async function removeMember(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const channelId = getInternalChatChannelId.call(context, itemIndex);
	const memberId = getInternalChatMemberId.call(context, itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/internal_chat/channels/${channelId}/members/${memberId}`,
	) as IDataObject;

	return { json: result || { success: true } };
}
