import type { IDataObject, IExecuteFunctions, IHttpRequestOptions, ILoadOptionsFunctions, IHookFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * Helper to get the Chatwoot base URL from credentials (for building external links)
 */
export async function getChatwootBaseUrl(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('fazerAiChatwootApi');
	let baseURL = credentials.url as string;

	// Remove trailing slash if present
	if (baseURL.endsWith('/')) {
		baseURL = baseURL.slice(0, -1);
	}

	return baseURL;
}

/**
 * Make an authenticated request to the Chatwoot API
 */
export async function chatwootApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<unknown> {
	const baseURL = await getChatwootBaseUrl.call(this);

	const options: IHttpRequestOptions = {
		method,
		baseURL,
		url: endpoint,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'fazerAiChatwootApi', options);
	} catch (error) {
		const err = error as Error & Record<string, unknown>;
		let apiErrors: string[] | undefined;

		if (err.context && typeof err.context === 'object') {
			const context = err.context as Record<string, unknown>;
			if (context.data && typeof context.data === 'object') {
				const data = context.data as Record<string, unknown>;
				if (Array.isArray(data.errors)) {
					apiErrors = data.errors;
				} else if (typeof data.error === 'string') {
					apiErrors = [data.error];
				}
			}
		}

		if (apiErrors && apiErrors.length > 0) {
			const errorMessage = apiErrors.join('; ');
			err.description = err.message;
			err.message = errorMessage;
		}

		throw error;
	}
}

/**
 * Make an authenticated multipart request to the Chatwoot API.
 * Mirrors chatwootApiRequest's error normalization but uses requestWithAuthentication
 * because httpRequestWithAuthentication does not support the `formData` field.
 */
export async function chatwootMultipartRequest(
	this: IExecuteFunctions,
	method: 'POST' | 'PUT' | 'PATCH',
	endpoint: string,
	formData: IDataObject,
): Promise<unknown> {
	const baseURL = await getChatwootBaseUrl.call(this);

	try {
		// eslint-disable-next-line @n8n/community-nodes/no-deprecated-workflow-functions -- httpRequestWithAuthentication does not expose `formData` for multipart uploads; same approach as conversation.sendFile.
		return await this.helpers.requestWithAuthentication.call(
			this,
			'fazerAiChatwootApi',
			{
				method,
				uri: `${baseURL}${endpoint}`,
				formData,
				json: true,
			},
		);
	} catch (error) {
		const err = error as Error & Record<string, unknown>;
		let apiErrors: string[] | undefined;

		if (err.response && typeof err.response === 'object') {
			const response = err.response as Record<string, unknown>;
			if (response.body && typeof response.body === 'object') {
				const data = response.body as Record<string, unknown>;
				if (Array.isArray(data.errors)) {
					apiErrors = data.errors;
				} else if (typeof data.error === 'string') {
					apiErrors = [data.error];
				}
			}
		}

		if (apiErrors && apiErrors.length > 0) {
			const errorMessage = apiErrors.join('; ');
			err.description = err.message;
			err.message = errorMessage;
		}

		throw error;
	}
}

/**
 * Async sleep helper for adding delays between operations.
 * NOTE: Uses setTimeout which is restricted on n8n Cloud.
 * This feature only works on self-hosted n8n installations.
 */
export function asyncSleep(ms: number): Promise<void> {
	// eslint-disable-next-line @n8n/community-nodes/no-restricted-globals
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract the value from a resourceLocator parameter that lives inside a collection.
 * Returns the raw string value or undefined when empty.
 */
export function extractResourceLocatorId(value: unknown): string | undefined {
	if (value === undefined || value === null) return undefined;
	if (typeof value === 'object') {
		const v = (value as { value?: string | number }).value;
		return extractResourceLocatorId(v);
	}
	if (typeof value === 'number') return Number.isFinite(value) ? String(value) : undefined;
	const trimmed = String(value).trim();
	return trimmed === '' ? undefined : trimmed;
}

/**
 * Same as extractResourceLocatorId but coerces to a positive integer.
 * Returns undefined for empty values, non-numeric input, decimals, or negatives.
 * Use this for IDs that must be sent as numbers in the API payload.
 */
export function extractResourceLocatorIdAsNumber(value: unknown): number | undefined {
	const id = extractResourceLocatorId(value);
	if (id === undefined) return undefined;
	if (!/^[1-9]\d*$/.test(id)) return undefined;
	const num = Number(id);
	return Number.isSafeInteger(num) ? num : undefined;
}

/**
 * Helper to get the ID from a resourceLocator parameter
 */
function getResourceId(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex: number,
	parameterName: string,
): string {
	try {
		const param = this.getNodeParameter(parameterName, itemIndex) as
		| string
		| number
		| { mode: string; value: string };

		if (!param) {
			throw new NodeOperationError(this.getNode(), 'Parameter is missing');
		}

		if (typeof param === 'object') {
			return param.value || '';
		}
		if (typeof param === 'number') {
			return String(param);
		}
		return param;
	}
	catch {
		throw new NodeOperationError(
			this.getNode(),
			`The parameter "${parameterName}" is required and must be a valid ID.`,
		);
	}
}

/**
 * Helper to get the account ID from parameters (handles resourceLocator)
 */
export function getAccountId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'accountId');
}

/**
 * Helper to get the inbox ID from parameters (handles resourceLocator)
 */
export function getInboxId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'inboxId');
}

/**
 * Helper to get the inbox ID from parameters (handles resourceLocator)
 */
export function getWhatsappSpecialProviderInboxId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'whatsappSpecialInboxId');
}

/**
 * Helper to get the conversation ID from parameters (handles resourceLocator)
 */
export function getConversationId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'conversationId');
}

/**
 * Helper to get the contact ID from parameters (handles resourceLocator)
 */
export function getContactId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'contactId');
}

/**
 * Helper to get the label ID from parameters (handles resourceLocator)
 */
export function getLabelId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'labelId');
}

/**
 * Helper to get the webhook ID from parameters (handles resourceLocator)
 */
export function getWebhookId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'webhookId');
}

/**
 * Helper to get the team ID from parameters (handles resourceLocator)
 */
export function getTeamId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'teamId');
}

/**
 * Helper to get the agent ID from parameters (handles resourceLocator)
 */
export function getAgentId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'agentId');
}

/**
 * Helper to get the team member ID from parameters (handles resourceLocator)
 */
export function getTeamMemberId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'teamMemberId');
}

/**
 * Helper to get the kanban board ID from parameters (handles resourceLocator)
 */
export function getKanbanBoardId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'kanbanBoardId');
}

/**
 * Helper to get the kanban step ID from parameters (handles resourceLocator)
 */
export function getKanbanStepId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'kanbanStepId');
}

/**
 * Helper to get the kanban product ID from parameters (handles resourceLocator)
 */
export function getKanbanProductId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'kanbanProductId');
}

/**
 * Helper to get kanban task ID from parameters (handles resourceLocator)
 */
export function getKanbanTaskId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'kanbanTaskId');
}

/**
 * Helper to get kanban task product ID from parameters (handles resourceLocator)
 */
export function getKanbanTaskProductId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'kanbanTaskProductId');
}

/**
 * Helper to get the message ID from parameters (handles resourceLocator)
 */
export function getMessageId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'messageId');
}

/**
 * Helper to get the scheduled message ID from parameters (handles resourceLocator)
 */
export function getScheduledMessageId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'scheduledMessageId');
}

/**
 * Helper to get the template name from parameters (handles resourceLocator)
 */
export function getTemplateName(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'templateName');
}

/**
 * Helper to get the custom attribute definition ID from parameters (handles resourceLocator)
 */
export function getCustomAttributeDefinitionId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'attributeKeyToDelete');
}

/**
 * Helper to get the internal chat category ID from parameters (handles resourceLocator)
 */
export function getInternalChatCategoryId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'internalChatCategoryId');
}

/**
 * Helper to get the internal chat channel ID from parameters (handles resourceLocator)
 */
export function getInternalChatChannelId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'internalChatChannelId');
}

/**
 * Helper to get the internal chat member ID from parameters (handles resourceLocator)
 */
export function getInternalChatMemberId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'internalChatMemberId');
}

/**
 * Helper to get the internal chat message ID from parameters (handles resourceLocator)
 */
export function getInternalChatMessageId(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number): string {
	return getResourceId.call(this, itemIndex, 'internalChatMessageId');
}
