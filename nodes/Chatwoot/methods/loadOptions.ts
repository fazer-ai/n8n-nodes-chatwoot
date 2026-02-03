import { ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";
import {
  ChatwootPayloadResponse,
  ChatwootAgent,
  ChatwootInbox,
  ChatwootCustomAttributeDefinition,
  ChatwootLabel,
  ChatwootTeam,
  ChatwootConversation,
  ChatwootContact,
  ChatwootKanbanBoard,
  ChatwootPayloadResponseWithData,
  ChatwootMessageTemplate,
} from "./resourceMapping";
import { chatwootApiRequest, getAccountId, getInboxId, getKanbanBoardId, getTemplateName } from "../shared/transport";

/**
 * Get all agents for the selected account (for loadOptions)
 */
export async function loadAgentsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/agents`,
  )) as ChatwootAgent[];
  const agents = response || [];

  return agents.map((agent: ChatwootAgent) => ({
    name: `#${agent.id} - ${agent.name || agent.email || 'Agent'}`,
    value: agent.id,
  }));
}

/**
 * Get all inboxes for the selected account (for loadOptions)
 */
export async function loadInboxesOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/inboxes`,
  )) as ChatwootPayloadResponse<ChatwootInbox>;
  const inboxes = response.payload ||[];

  return (inboxes as ChatwootInbox[]).map((inbox: ChatwootInbox) => ({
    name: `#${inbox.id} - ${inbox.name}`,
    value: inbox.id,
  }));
}

/**
 * Get all teams for the selected account (for loadOptions)
 */
export async function loadTeamsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/teams`,
  )) as ChatwootTeam[];
  const teams = response || [];

  return teams.map((team: ChatwootTeam) => ({
    name: `#${team.id} - ${team.name}`,
    value: team.id,
  }));
}

/**
 * Get all labels for the selected account (for loadOptions)
 * The value is label title instead of ID because Chatwoot API requires titles when adding/removing labels from conversations
*/
export async function loadLabelsWithTitleValueOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
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

  return (labels as ChatwootLabel[]).map((label: ChatwootLabel) => ({
    name: `#${label.id} - ${label.title}`,
    value: label.title,
  }));
}

/**
 * Get contact custom attribute definitions for the selected account (for loadOptions)
 */
export async function loadContactCustomAttributeDefinitionsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/custom_attribute_definitions`,
    undefined,
    { attribute_model: 'contact_attribute' },
  )) as ChatwootCustomAttributeDefinition[];

  return (response || []).map((attr: ChatwootCustomAttributeDefinition) => ({
    name: `${attr.attribute_display_name} (${attr.attribute_key})`,
    value: attr.attribute_key,
    description: `[${attr.attribute_display_type}]${attr.attribute_description ? ` - ${attr.attribute_description}` : ''}`,
  }));
}

/**
 * Get conversation custom attribute definitions for the selected account (for loadOptions)
 */
export async function loadConversationCustomAttributeDefinitionsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/custom_attribute_definitions`,
    undefined,
    { attribute_model: 'conversation_attribute' },
  )) as ChatwootCustomAttributeDefinition[];

  return (response || []).map((attr: ChatwootCustomAttributeDefinition) => ({
    name: `${attr.attribute_display_name} (${attr.attribute_key})`,
    value: attr.attribute_key,
    description: `[${attr.attribute_display_type}]${attr.attribute_description ? ` - ${attr.attribute_description}` : ''}`,
  }));
}

/**
 * Get custom attribute definitions based on selected model
 */
export async function loadCustomAttributeDefinitionsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const attributeModel = this.getNodeParameter('attributeModel', 0) as string;

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/custom_attribute_definitions`,
    undefined,
    { attribute_model: attributeModel },
  )) as ChatwootCustomAttributeDefinition[];

  return (response || []).map((attr: ChatwootCustomAttributeDefinition) => ({
    name: `#${attr.id} - ${attr.attribute_display_name}`,
    value: attr.id,
  }));
}

/**
 * Get all agents for the selected kanban board (for loadOptions)
 */
export async function loadKanbanBoardAgentsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }
  const boardId = getKanbanBoardId.call(this, 0);
  if (!boardId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/kanban/boards/${boardId}`,
  )) as ChatwootKanbanBoard;
  const agents = response.assigned_agents || [];
  return (agents as ChatwootAgent[]).map((agent) => ({
    name: `#${agent.id} - ${agent.name || agent.email || 'Agent'}`,
    value: agent.id,
  }));
}

/**
 * Get all conversations for the selected kanban board (for loadOptions)
 */
export async function loadKanbanBoardConversationsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }
  const boardId = getKanbanBoardId.call(this, 0);
  if (!boardId) {
    return [];
  }

  const board = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/kanban/boards/${boardId}`,
  )) as ChatwootKanbanBoard;

  const inboxes = board.assigned_inboxes || [];
  let conversations: INodePropertyOptions[] = [];

  for (const inbox of inboxes) {
    const response = (await chatwootApiRequest.call(
      this,
      'GET',
      `/api/v1/accounts/${accountId}/conversations`,
      undefined,
      { inbox_id: inbox.id },
    )) as ChatwootPayloadResponseWithData<ChatwootConversation>;

    conversations = conversations.concat(response.data?.payload?.map((conversation) => ({
      name: `#${conversation.id} - (${inbox.name}) ${conversation.meta?.sender?.name || conversation.meta?.sender?.email || 'Unknown'}`,
      value: conversation.id,
    })) ?? [])
  }

  return conversations;
}

/**
 * Get all steps for the selected kanban board (for loadOptions)
 */
export async function loadKanbanStepsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }
  const boardId = getKanbanBoardId.call(this, 0);
  if (!boardId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/kanban/boards/${boardId}/steps`,
  )) as { steps: Array<{ id: number; name: string }> };

  const steps = response.steps || [];
  return steps.map((step, index) => ({
    name: `Step ${index + 1} - ${step.name}`,
    value: step.id,
  }));
}

/**
 * Get all contacts for the selected kanban board (for loadOptions)
*/
export async function loadContactsOptions(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  if (!accountId) {
    return [];
  }

  const response = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/contacts`,
    undefined,
    { sort: '-last_activity_at' },
  )) as ChatwootPayloadResponse<ChatwootContact> | ChatwootContact[];
  const contacts =
    (response as ChatwootPayloadResponse<ChatwootContact>).payload ||
    (response as ChatwootContact[]) ||
    [];

  return (contacts as ChatwootContact[]).map((contact) => ({
    name: `#${contact.id} - ${contact.name || contact.email || 'Contact'}`,
    value: contact.id,
  }));
}

/**
 * Load template structure preview for the selected template (for loadOptions dropdown)
 */
export async function loadTemplatePreview(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const accountId = getAccountId.call(this, 0);
  const inboxId = getInboxId.call(this, 0);
  const templateName = getTemplateName.call(this, 0);

  if (!accountId || !inboxId || !templateName) {
    return [{ name: 'Select an Inbox and Template First', value: '' }];
  }

  const inbox = (await chatwootApiRequest.call(
    this,
    'GET',
    `/api/v1/accounts/${accountId}/inboxes/${inboxId}`,
  )) as ChatwootInbox;

  const templates = inbox.message_templates || [];
  const template = templates.find((t: ChatwootMessageTemplate) => t.name === templateName);

  if (!template) {
    return [{ name: `Template "${templateName}" not found in inbox`, value: '' }];
  }

  const options: INodePropertyOptions[] = [];

  for (const component of template.components) {
    switch (component.type) {
      case 'HEADER': {
        if (component.format === 'TEXT') {
          options.push({ name: `📋 HEADER (text): "${component.text}"`, value: 'header' });
        } else if (component.format) {
          options.push({ name: `📋 HEADER (${component.format.toLowerCase()}): requires media URL`, value: 'header' });
        }
        break;
      }
      case 'BODY': {
        const paramCount = (component.text?.match(/\{\{\d+\}\}/g) || []).length;
        const preview = component.text || '';
        if (paramCount > 0) {
          options.push({ name: `📝 BODY [${paramCount} params]: "${preview}"`, value: 'body' });
        } else {
          options.push({ name: `📝 BODY: "${preview}"`, value: 'body' });
        }
        break;
      }
      case 'FOOTER': {
        options.push({ name: `📎 FOOTER: "${component.text}"`, value: 'footer' });
        break;
      }
      case 'BUTTONS': {
        const buttons = component.buttons || [];
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i];
          if (btn.type === 'URL' && btn.url?.includes('{{')) {
            options.push({ name: `🔘 Button ${i + 1}: URL "${btn.text}" [requires param]`, value: `button_${i}` });
          } else if (btn.type === 'URL') {
            options.push({ name: `🔘 Button ${i + 1}: URL "${btn.text}"`, value: `button_${i}` });
          } else if (btn.type === 'QUICK_REPLY') {
            options.push({ name: `🔘 Button ${i + 1}: Quick reply "${btn.text}"`, value: `button_${i}` });
          } else if (btn.type === 'PHONE_NUMBER') {
            options.push({ name: `🔘 Button ${i + 1}: Phone "${btn.text}"`, value: `button_${i}` });
          } else {
            options.push({ name: `🔘 Button ${i + 1}: ${btn.type} "${btn.text}"`, value: `button_${i}` });
          }
        }
        break;
      }
    }
  }

  if (options.length === 0) {
    options.push({ name: 'Template has no components', value: '' });
  }

  return options;
}
