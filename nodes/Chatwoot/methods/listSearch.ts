import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { chatwootApiRequest, getAccountId, getChatwootBaseUrl, getConversationId, getInboxId, getKanbanBoardId, getMessageId, getTeamId, getTemplateName } from '../shared/transport';
import {
	ChatwootAccount,
	ChatwootAgent,
	ChatwootAttachment,
	ChatwootContact,
	ChatwootConversation,
	ChatwootInbox,
	ChatwootKanbanBoard,
	ChatwootKanbanStep,
	ChatwootKanbanTask,
	ChatwootLabel,
	ChatwootMessage,
	ChatwootMessageTemplate,
	ChatwootPayloadResponse,
	ChatwootPayloadResponseWithData,
	ChatwootProfileResponse,
	ChatwootScheduledMessage,
	ChatwootTeam,
	ChatwootTeamMember,
	ChatwootWebhook
} from './resourceMapping';

/**
 * Get all accounts available to the user (for resourceLocator)
 */
export async function searchAccounts(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		'/api/v1/profile',
	)) as ChatwootProfileResponse;
	const accounts = response.accounts || [];

	let results = accounts.map((account: ChatwootAccount) => ({
		name: `#${account.id} - ${account.name}`,
		value: String(account.id),
		url: `${baseUrl}/app/accounts/${account.id}/dashboard`,
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all inboxes for the selected account (for resourceLocator)
 */
export async function searchInboxes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/inboxes`,
	)) as ChatwootPayloadResponse<ChatwootInbox> | ChatwootInbox[];
	const inboxes =
		(response as ChatwootPayloadResponse<ChatwootInbox>).payload ||
		(response as ChatwootInbox[]) ||
		[];

	let results = (inboxes as ChatwootInbox[]).map((inbox: ChatwootInbox) => ({
		name: `#${inbox.id} - ${inbox.name}`,
		value: String(inbox.id),
		url: `${baseUrl}/app/accounts/${accountId}/settings/inboxes/${inbox.id}`,
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all WhatsApp Baileys and Z-API inboxes for the selected account (for resourceLocator)
 */
export async function searchWhatsappSpecialProvidersInboxes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/inboxes`,
	)) as ChatwootPayloadResponse<ChatwootInbox> | ChatwootInbox[];
	const inboxes =
		(response as ChatwootPayloadResponse<ChatwootInbox>).payload ||
		(response as ChatwootInbox[]) ||
		[];

	const filteredInboxes = (inboxes as ChatwootInbox[]).filter(
		(inbox: ChatwootInbox) =>
			inbox.channel_type === 'Channel::Whatsapp' && (inbox.provider === 'baileys' || inbox.provider === 'zapi'),
	);

	let results = filteredInboxes.map((inbox: ChatwootInbox) => ({
		name: `#${inbox.id} - ${inbox.name}`,
		value: String(inbox.id),
		url: `${baseUrl}/app/accounts/${accountId}/settings/inboxes/${inbox.id}`,
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all conversations for the selected account/inbox (for resourceLocator)
 */
export async function searchConversations(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const inboxId = getInboxId.call(this, 0);
	if (accountId === '' || inboxId === '') {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);
	const page = paginationToken ? Number(paginationToken) : 1;

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/conversations`,
		undefined,
		{ q: filter || '', page, inbox_id: inboxId || undefined },
	)) as ChatwootPayloadResponseWithData<ChatwootConversation>;

	const results = response.data.payload.map(
		({ id, meta }: ChatwootConversation) => {
			const { name, email, phone_number } = meta.sender;
			return {
				name: `#${id} - ${name || email || phone_number || 'Unknown'}`,
				value: String(id),
				url: `${baseUrl}/app/accounts/${accountId}/conversations/${id}`,
			};
		},
	);

	return { results };
}

/**
 * Get all scheduled messages for the selected conversation (for resourceLocator)
 */
export async function searchScheduledMessages(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const conversationId = getConversationId.call(this, 0);
	if (accountId === '' || conversationId === '') {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/scheduled_messages`,
	)) as { payload?: ChatwootScheduledMessage[] };

	const scheduledMessages = response.payload || [];

	let results = scheduledMessages.map((sm: ChatwootScheduledMessage) => {
		const contentPreview = sm.content?.substring(0, 30) || 'No content';
		const scheduledDate = sm.scheduled_at ? new Date(sm.scheduled_at * 1000).toISOString() : 'Not scheduled';
		return {
			name: `#${sm.id} - ${sm.status} - ${contentPreview}${sm.content && sm.content.length > 30 ? '...' : ''} (${scheduledDate})`,
			value: String(sm.id),
		};
	});

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all contacts for the selected account (for resourceLocator)
 */
export async function searchContacts(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	let endpoint = `/api/v1/accounts/${accountId}/contacts`;
	if (filter) {
		endpoint += '/search';
	}

	const page = paginationToken ? Number(paginationToken) : 1;
	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		endpoint,
		undefined,
		{
			q: filter || '',
			page,
			sort: '-last_activity_at',
			include_contact_inboxes: false,
		},
	)) as ChatwootPayloadResponse<ChatwootContact>;

	const results = response.payload.map(
		(contact: ChatwootContact) => ({
			name: `#${contact.id} - ${contact.name || contact.email || 'Contact'}`,
			value: String(contact.id),
			url: `${baseUrl}/app/accounts/${accountId}/contacts/${contact.id}`,
		}),
	);

	return { results };
}

/**
 * Get all agents for the selected account (for resourceLocator)
 */
export async function searchAgents(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/agents`,
	)) as ChatwootAgent[];
	const agents = response || [];

	let results = agents.map((agent: ChatwootAgent) => ({
		name: `#${agent.id} - ${agent.name || agent.email || 'Agent'}`,
		value: String(agent.id),
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all teams for the selected account (for resourceLocator)
 */
export async function searchTeams(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/teams`,
	)) as ChatwootTeam[];
	const teams = response || [];

	let results = teams.map((team: ChatwootTeam) => ({
		name: `#${team.id} - ${team.name}`,
		value: String(team.id),
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all members of the selected team (for resourceLocator/listSearch)
 */
export async function searchTeamMembers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const teamId = getTeamId.call(this, 0);
	if (!accountId || !teamId) {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/teams/${teamId}/team_members`,
	)) as ChatwootTeamMember[];
	const members = response || [];

	let results = members.map((member: ChatwootTeamMember) => ({
		name: `#${member.id} - ${member.name || member.email || 'Agent'}`,
		value: String(member.id),
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Search labels for the selected account (for resourceLocator)
 */
export async function searchLabels(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/labels`,
	)) as ChatwootPayloadResponse<ChatwootLabel> | ChatwootLabel[];
	const labels =
		(response as ChatwootPayloadResponse<ChatwootLabel>).payload ||
		(response as ChatwootLabel[]) ||
		[];

	let results = (labels as ChatwootLabel[]).map((label: ChatwootLabel) => ({
		name: `#${label.id} - ${label.title}`,
		value: String(label.id),
	}));

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all webhooks for the selected account (for resourceLocator)
 */
export async function searchWebhooks(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/webhooks`,
	)) as ChatwootPayloadResponse<ChatwootWebhook> | ChatwootWebhook[];
	const webhooks =
		(response as ChatwootPayloadResponse<ChatwootWebhook>).payload ||
		(response as ChatwootWebhook[]) ||
		[];

	let results = (webhooks as ChatwootWebhook[]).map(
		(webhook: ChatwootWebhook) => ({
			name: `#${webhook.id} - ${webhook.url}`,
			value: String(webhook.id),
		}),
	);

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get all kanban boards for the selected account (for resourceLocator)
 */
export async function searchKanbanBoards(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	if (accountId === '') {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/boards`,
	)) as { boards?: ChatwootKanbanBoard[] } | ChatwootKanbanBoard[];

	const boards =
		(response as { boards?: ChatwootKanbanBoard[] }).boards ||
		(response as ChatwootKanbanBoard[]) ||
		[];

	const results = boards.map((board: ChatwootKanbanBoard) => ({
		name: `#${board.id} - ${board.name}`,
		value: String(board.id),
		url: `${baseUrl}/app/accounts/${accountId}/kanban/boards/${board.id}`,
	}));

	return { results };
}

/**
 * Get all kanban steps for the selected board (for resourceLocator)
 */
export async function searchKanbanSteps(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const boardId = getKanbanBoardId.call(this, 0);

	if (!accountId || !boardId) {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/boards/${boardId}/steps`,
	)) as { steps?: ChatwootKanbanStep[] } | ChatwootKanbanStep[];

	const steps =
		(response as { steps?: ChatwootKanbanStep[] }).steps ||
		(response as ChatwootKanbanStep[]) ||
		[];

	const results = steps.map((step: ChatwootKanbanStep, index: number) => ({
		name: `Step ${index + 1} - ` + (step.cancelled ? `(Cancelled) ` : '') + step.name + (step.description ? `: ${step.description}` : ''),
		value: String(step.id),
		url: `${baseUrl}/app/accounts/${accountId}/kanban/boards/${boardId}`,
	}));

	return { results };
}

/**
 * Get all kanban tasks for the selected board (for resourceLocator)
 */
export async function searchKanbanTasks(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const boardId = getKanbanBoardId.call(this, 0);

	if (!accountId || !boardId) {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/kanban/tasks`,
		undefined,
		{ board_id: boardId, sort: 'updated_at', order: 'desc' },
	)) as { tasks?: ChatwootKanbanTask[] } | ChatwootKanbanTask[];

	const tasks =
		(response as { tasks?: ChatwootKanbanTask[] }).tasks ||
		(response as ChatwootKanbanTask[]) ||
		[];

	const results = tasks.map((task: ChatwootKanbanTask) => {
		let suffix = '';
		// Always show step name if available
		if (task.board?.steps && task.board_step_id) {
			const stepIndex = task.board.steps.findIndex((s) => s.id === task.board_step_id);
			if (stepIndex !== -1) {
				const step = task.board.steps[stepIndex];
				suffix = ` (Step ${stepIndex + 1}: ${step.name})`;
			}
		}
		// Append status if cancelled/completed
		if (task.status === 'cancelled' || task.status === 'completed') {
			suffix += ` [${task.status}]`;
		}
		return {
			name: `#${task.id} - ${task.title}${suffix}`,
			value: String(task.id),
			url: `${baseUrl}/app/accounts/${accountId}/kanban/boards/${boardId}`,
		};
	});

	return { results };
}

/**
 * Get messages for the selected conversation (for resourceLocator)
 */
export async function searchMessages(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const conversationId = getConversationId.call(this, 0);

	if (!accountId || !conversationId) {
		return { results: [] };
	}

	const baseUrl = await getChatwootBaseUrl.call(this);

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
	)) as { payload?: ChatwootMessage[] };

	const messages = (response.payload || []).reverse();

	let results = messages.map((message: ChatwootMessage) => {
		const preview = message.content
			? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
			: '(no content)';
		return {
			name: `Message #${message.id} - ${preview}`,
			value: String(message.id),
			url: `${baseUrl}/app/accounts/${accountId}/conversations/${conversationId}?messageId=${message.id}`,
		};
	});

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Get attachments for the selected conversation (for resourceLocator)
 */
export async function searchAttachments(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const conversationId = getConversationId.call(this, 0);
	let messageId: string | undefined;
	try {
		messageId = getMessageId.call(this, 0);
	} catch {
		// Message not selected yet
	}

	if (!accountId || !conversationId) {
		return { results: [] };
	}

	const response = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/conversations/${conversationId}/attachments`,
	)) as { payload?: ChatwootAttachment[] };

	let attachments = (response.payload || []).reverse();

	if (messageId) {
		attachments = attachments.filter((a) => String(a.message_id) === messageId);
	}

	let results = attachments.map((attachment: ChatwootAttachment) => {
		const fileName = decodeURIComponent(attachment.data_url?.split('/').pop() || 'attachment');
		const type = attachment.file_type || 'file';
		return {
			name: `#${attachment.id} - ${type}: ${fileName}`,
			value: String(attachment.id),
		};
	});

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.includes(filter),
		);
	}

	return { results };
}

/**
 * Build a human-readable description of a template's structure
 */
function buildTemplateDescription(template: ChatwootMessageTemplate): string {
	const parts: string[] = [];

	for (const component of template.components) {
		switch (component.type) {
			case 'HEADER': {
				if (component.format === 'TEXT') {
					parts.push(`HEADER (text): "${component.text}"`);
				} else if (component.format) {
					parts.push(`HEADER (${component.format.toLowerCase()}): requires media URL`);
				}
				break;
			}
			case 'BODY': {
				const paramCount = (component.text?.match(/\{\{\d+\}\}/g) || []).length;
				const preview = component.text?.substring(0, 80) + (component.text && component.text.length > 80 ? '...' : '');
				if (paramCount > 0) {
					parts.push(`BODY: "${preview}" [${paramCount} param${paramCount > 1 ? 's' : ''}]`);
				} else {
					parts.push(`BODY: "${preview}"`);
				}
				break;
			}
			case 'FOOTER': {
				parts.push(`FOOTER: "${component.text}"`);
				break;
			}
			case 'BUTTONS': {
				const buttons = component.buttons || [];
				const buttonDescriptions = buttons.map((btn, idx) => {
					if (btn.type === 'URL' && btn.url?.includes('{{')) {
						return `  ${idx + 1}. URL button "${btn.text}" [requires param]`;
					} else if (btn.type === 'URL') {
						return `  ${idx + 1}. URL button "${btn.text}"`;
					} else if (btn.type === 'QUICK_REPLY') {
						return `  ${idx + 1}. Quick reply "${btn.text}"`;
					} else if (btn.type === 'PHONE_NUMBER') {
						return `  ${idx + 1}. Phone button "${btn.text}"`;
					}
					return `  ${idx + 1}. ${btn.type} "${btn.text}"`;
				});
				parts.push(`BUTTONS:\n${buttonDescriptions.join('\n')}`);
				break;
			}
		}
	}

	return parts.join('\n');
}

/**
 * Get WhatsApp message templates for the selected inbox (for resourceLocator)
 */
export async function searchMessageTemplates(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const inboxId = getInboxId.call(this, 0);

	if (!accountId || !inboxId) {
		return { results: [] };
	}

	const inbox = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/inboxes/${inboxId}`,
	)) as ChatwootInbox;

	const templates = inbox.message_templates || [];

	let results = templates.map((template: ChatwootMessageTemplate) => {
		// Find body component to show preview in the name
		const bodyComponent = template.components.find(c => c.type === 'BODY');
		const bodyPreview = bodyComponent?.text
			? bodyComponent.text.substring(0, 50) + (bodyComponent.text.length > 50 ? '...' : '')
			: '';

		return {
			name: `${template.name} (${template.language}) - ${template.category}${bodyPreview ? ` | ${bodyPreview}` : ''}`,
			value: template.name,
			description: buildTemplateDescription(template),
		};
	});

	if (filter) {
		const filterLower = filter.toLowerCase();
		results = results.filter(
			(item) =>
				item.name.toLowerCase().includes(filterLower) ||
				item.value.toLowerCase().includes(filterLower),
		);
	}

	return { results };
}

/**
 * Get template structure for the currently selected template (for resourceLocator preview)
 */
export async function searchTemplateStructure(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const accountId = getAccountId.call(this, 0);
	const inboxId = getInboxId.call(this, 0);
	const templateName = getTemplateName.call(this, 0);

	if (!accountId || !inboxId || !templateName) {
		return {
			results: [
				{
					name: 'Select an Inbox and Template First',
					value: '',
				},
			],
		};
	}

	const inbox = (await chatwootApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/${accountId}/inboxes/${inboxId}`,
	)) as ChatwootInbox;

	const templates = inbox.message_templates || [];
	const template = templates.find((t) => t.name === templateName);

	if (!template) {
		return {
			results: [
				{
					name: `Template "${templateName}" not found`,
					value: '',
				},
			],
		};
	}

	// Build structure items - each component as a separate selectable item for visibility
	const results: INodeListSearchItems[] = [];

	for (const component of template.components) {
		switch (component.type) {
			case 'HEADER': {
				if (component.format === 'TEXT') {
					results.push({
						name: `📋 HEADER (text): "${component.text}"`,
						value: 'header',
					});
				} else if (component.format) {
					results.push({
						name: `📋 HEADER (${component.format.toLowerCase()}): requires media URL`,
						value: 'header',
					});
				}
				break;
			}
			case 'BODY': {
				const paramCount = (component.text?.match(/\{\{\d+\}\}/g) || []).length;
				const text = component.text || '';
				if (paramCount > 0) {
					results.push({
						name: `📝 BODY [${paramCount} params]: "${text}"`,
						value: 'body',
					});
				} else {
					results.push({
						name: `📝 BODY: "${text}"`,
						value: 'body',
					});
				}
				break;
			}
			case 'FOOTER': {
				results.push({
					name: `📎 FOOTER: "${component.text}"`,
					value: 'footer',
				});
				break;
			}
			case 'BUTTONS': {
				const buttons = component.buttons || [];
				for (let i = 0; i < buttons.length; i++) {
					const btn = buttons[i];
					if (btn.type === 'URL' && btn.url?.includes('{{')) {
						results.push({
							name: `🔘 Button ${i}: URL "${btn.text}" [requires param]`,
							value: `button_${i}`,
						});
					} else if (btn.type === 'URL') {
						results.push({
							name: `🔘 Button ${i}: URL "${btn.text}"`,
							value: `button_${i}`,
						});
					} else if (btn.type === 'QUICK_REPLY') {
						results.push({
							name: `🔘 Button ${i}: Quick Reply "${btn.text}"`,
							value: `button_${i}`,
						});
					} else if (btn.type === 'COPY_CODE') {
						results.push({
							name: `🔘 Button ${i}: Copy Code [requires param]`,
							value: `button_${i}`,
						});
					} else {
						results.push({
							name: `🔘 Button ${i}: ${btn.type} "${btn.text}"`,
							value: `button_${i}`,
						});
					}
				}
				break;
			}
		}
	}

	if (results.length === 0) {
		results.push({
			name: 'No components found in template',
			value: '',
		});
	}

	return { results };
}
