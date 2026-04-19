export interface ChatwootAccount {
  id: number;
  name: string;
}

export interface ChatwootInbox {
  id: number;
  name: string;
  channel_type?: string;
  provider?: string;
  message_templates?: ChatwootMessageTemplate[];
}

export interface ChatwootMessageTemplate {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
  components: Array<{
    text?: string;
    type: string;
    format?: string;
    example?: {
      body_text?: string[][];
      header_parameters?: string[];
    };
    buttons?: Array<{
      url?: string;
      text: string;
      type: string;
      example?: string[];
    }>;
  }>;
  parameter_format?: string;
  library_template_name?: string;
}

export interface ChatwootConversation {
  id: number;
  meta: {
    sender: {
      name?: string;
      email?: string;
      phone_number?: string;
    };
  };
}

export interface ChatwootContact {
  id: number;
  name?: string;
  email?: string;
}

export interface ChatwootAgent {
  id: number;
  name?: string;
  email?: string;
}

export interface ChatwootTeam {
  id: number;
  name: string;
}

export interface ChatwootLabel {
  id:	number;
  title: string;
}

export interface ChatwootWebhook {
  id: number;
  url: string;
  name?: string;
  subscriptions?: string[];
  secret?: string;
}

export interface ChatwootProfileResponse {
  accounts?: ChatwootAccount[];
}

export interface ChatwootPayloadResponse<T> {
  meta: {
    count: number;
    current_page: number;
  };
  payload: T[];
}

export interface ChatwootPayloadResponseWithData<T> {
  data: ChatwootPayloadResponse<T>;
}

export interface ChatwootKanbanBoard {
  id: number;
  name: string;
  assigned_agents: ChatwootAgent[];
  assigned_inboxes: ChatwootInbox[];
}

export interface ChatwootKanbanProduct {
  id: number;
  name: string;
  description?: string;
  unit_price?: number;
  archived?: boolean;
}

export interface ChatwootKanbanStep {
  id: number;
  name: string;
  description: string,
  cancelled: boolean;
}

export interface ChatwootKanbanTask {
  id: number;
  title: string;
  status?: string;
  board?: {
    id: number;
    name: string;
    steps?: Array<{ id: number; name: string; color?: string }>;
  };
  board_step_id?: number;
}

export interface ChatwootKanbanTaskProduct {
  id: number;
  task_id: number;
  product_id: number;
  product?: { id: number; name: string };
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  line_total: number;
}

export interface ChatwootMessage {
  id: number;
  content?: string;
  message_type?: string;
  created_at?: string;
}

export interface ChatwootScheduledMessage {
  id: number;
  content?: string;
  status?: string;
  scheduled_at?: number;
  created_at?: number;
}

export interface ChatwootTeamMember {
	id: number;
	name?: string;
	email?: string;
}

export interface ChatwootCustomAttributeDefinition {
	id: number;
	attribute_key: string;
	attribute_display_name: string;
	attribute_display_type: string;
	attribute_description: string;
	attribute_model: number;
}

export interface ChatwootAttachment {
	id: number;
	message_id: number;
	file_type: string;
	data_url: string;
	thumb_url?: string;
	file_size?: number;
	extension?: string | null;
	width?: number;
	height?: number;
	created_at?: number;
	sender?: {
		id: number;
		name: string;
		available_name?: string;
		avatar_url?: string;
		type: string;
	};
}

export interface ChatwootInternalChatCategory {
	id: number;
	name: string;
	position?: number;
	channels_count?: number;
}

export interface ChatwootInternalChatChannel {
	id: number;
	name?: string | null;
	description?: string | null;
	channel_type: 'public_channel' | 'private_channel' | 'dm';
	is_dm?: boolean;
	status?: 'active' | 'archived';
	category_id?: number | null;
	members_count?: number;
	unread_count?: number;
	members?: Array<{ user_id: number; name?: string; avatar_url?: string | null; availability_status?: string }>;
}

export interface ChatwootInternalChatMember {
	id: number;
	user_id: number;
	role?: 'admin' | 'member';
	name?: string;
	avatar_url?: string | null;
}

export interface ChatwootInternalChatMessage {
	id: number;
	content?: string | null;
	content_type?: string;
	internal_chat_channel_id?: number;
	sender?: { id: number; name?: string } | null;
	parent_id?: number | null;
	created_at?: string;
	poll?: { id: number; question?: string };
}
