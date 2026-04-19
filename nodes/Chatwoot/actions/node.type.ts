import type { AccountOperation } from './account/types';
import type { AgentOperation } from './agent/types';
import type { ContactOperation } from './contact/types';
import type { ConversationOperation } from './conversation/types';
import type { CustomAttributeOperation } from './customAttribute/types';
import type { InboxOperation } from './inbox/types';
import type { InternalChatCategoryOperation } from './internalChatCategory/types';
import type { InternalChatChannelOperation } from './internalChatChannel/types';
import type { InternalChatMemberOperation } from './internalChatMember/types';
import type { InternalChatMessageOperation } from './internalChatMessage/types';
import type { KanbanBoardOperation } from './kanbanBoard/types';
import type { KanbanProductOperation } from './kanbanProduct/types';
import type { KanbanStepOperation } from './kanbanStep/types';
import type { KanbanTaskOperation } from './kanbanTask/types';
import type { KanbanTaskProductOperation } from './kanbanTaskProduct/types';
import type { LabelOperation } from './label/types';
import type { ProfileOperation } from './profile/types';
import type { ScheduledMessageOperation } from './scheduledMessage/types';
import type { TeamOperation } from './team/types';

export type ChatwootResources =
	| 'account'
	| 'agent'
	| 'contact'
	| 'conversation'
	| 'customAttribute'
	| 'inbox'
	| 'internalChatCategory'
	| 'internalChatChannel'
	| 'internalChatMember'
	| 'internalChatMessage'
	| 'kanbanBoard'
	| 'kanbanProduct'
	| 'kanbanStep'
	| 'kanbanTask'
	| 'kanbanTaskProduct'
	| 'label'
	| 'profile'
	| 'scheduledMessage'
	| 'team';

export type ChatwootOperations =
	| AccountOperation
	| AgentOperation
	| ContactOperation
	| ConversationOperation
	| CustomAttributeOperation
	| InboxOperation
	| InternalChatCategoryOperation
	| InternalChatChannelOperation
	| InternalChatMemberOperation
	| InternalChatMessageOperation
	| KanbanBoardOperation
	| KanbanProductOperation
	| KanbanStepOperation
	| KanbanTaskOperation
	| KanbanTaskProductOperation
	| LabelOperation
	| ProfileOperation
	| ScheduledMessageOperation
	| TeamOperation;

export type {
	AccountOperation,
	AgentOperation,
	ContactOperation,
	ConversationOperation,
	CustomAttributeOperation,
	InboxOperation,
	InternalChatCategoryOperation,
	InternalChatChannelOperation,
	InternalChatMemberOperation,
	InternalChatMessageOperation,
	KanbanBoardOperation,
	KanbanProductOperation,
	KanbanStepOperation,
	KanbanTaskOperation,
	KanbanTaskProductOperation,
	LabelOperation,
	ProfileOperation,
	ScheduledMessageOperation,
	TeamOperation,
};
