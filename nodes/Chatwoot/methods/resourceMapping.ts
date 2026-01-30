export interface ChatwootAccount {
  id: number;
  name: string;
}

export interface ChatwootInbox {
  id: number;
  name: string;
  channel_type?: string;
  provider?: string;
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

export interface ChatwootMessage {
  id: number;
  content?: string;
  message_type?: string;
  created_at?: string;
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
