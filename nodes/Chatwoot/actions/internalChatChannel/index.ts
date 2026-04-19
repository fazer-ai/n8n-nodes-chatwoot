import type { INodeProperties } from 'n8n-workflow';
import {
	accountSelector,
	internalChatCategoryOptionalSelector,
	internalChatChannelSelector,
	internalChatMessageSelector,
} from '../../shared/descriptions';

const showOnlyForInternalChatChannel = {
	resource: ['internalChatChannel'],
};

const internalChatChannelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInternalChatChannel,
		},
		options: [
			{
				name: 'Archive',
				value: 'archive',
				description: 'Archive an internal chat channel',
				action: 'Archive internal chat channel',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new internal chat channel or DM',
				action: 'Create internal chat channel',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Permanently delete an internal chat channel and all its messages',
				action: 'Delete internal chat channel',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of an internal chat channel',
				action: 'Get internal chat channel',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List internal chat channels',
				action: 'List internal chat channels',
			},
			{
				name: 'Mark as Read',
				value: 'markRead',
				description: 'Mark all messages in the channel as read',
				action: 'Mark internal chat channel as read',
			},
			{
				name: 'Mark as Unread',
				value: 'markUnread',
				description: 'Mark the channel as unread from a specific message',
				action: 'Mark internal chat channel as unread',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search across channels, DMs, and messages',
				action: 'Search internal chat',
			},
			{
				name: 'Toggle Typing Status',
				value: 'toggleTyping',
				description: 'Toggle typing indicator in the channel (useful to signal a bot is processing a message)',
				action: 'Toggle typing status in internal chat channel',
			},
			{
				name: 'Unarchive',
				value: 'unarchive',
				description: 'Unarchive an internal chat channel',
				action: 'Unarchive internal chat channel',
			},
			{
				name: 'Update',
				value: 'update',
				description: "Update an internal chat channel's attributes",
				action: 'Update internal chat channel',
			},
		],
		default: 'list',
	},
];

const internalChatChannelFields: INodeProperties[] = [
	{
		displayName: 'Internal chat is only available on <a href="https://github.com/fazer-ai/chatwoot/pkgs/container/chatwoot" target="_blank">Chatwoot fazer.ai</a>',
		name: 'fazerAiNotice',
		type: 'notice',
		default: '',
		typeOptions: {
			theme: 'info',
		},
		displayOptions: {
			show: showOnlyForInternalChatChannel,
		},
	},
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForInternalChatChannel,
		},
	},
	{
		...internalChatChannelSelector,
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: [
					'get',
					'update',
					'delete',
					'archive',
					'unarchive',
					'markRead',
					'markUnread',
					'toggleTyping',
				],
			},
		},
	},
	{
		displayName: 'Channel Type',
		name: 'channelType',
		type: 'options',
		default: 'public_channel',
		required: true,
		description: 'Type of channel to create',
		options: [
			{ name: 'Public Channel', value: 'public_channel' },
			{ name: 'Private Channel', value: 'private_channel' },
			{ name: 'Direct Message (DM)', value: 'dm' },
		],
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the channel',
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['create'],
				channelType: ['public_channel', 'private_channel'],
			},
		},
	},
	{
		displayName: 'Recipient Name or ID',
		name: 'dmMemberId',
		type: 'options',
		default: '',
		required: true,
		description: 'User to start the DM with. The current user is added automatically. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'loadAgentsOptions',
		},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['create'],
				channelType: ['dm'],
			},
		},
	},
	{
		displayName: 'Member Names or IDs',
		name: 'memberIds',
		type: 'multiOptions',
		default: [],
		description: 'Users to add as initial channel members. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'loadAgentsOptions',
		},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['create'],
				channelType: ['private_channel'],
			},
		},
	},
	{
		displayName: 'Team Names or IDs',
		name: 'teamIds',
		type: 'multiOptions',
		default: [],
		description: 'Teams whose members will be added as initial channel members. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'loadTeamsOptions',
		},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['create'],
				channelType: ['private_channel'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['create'],
			},
		},
		options: [
			internalChatCategoryOptionalSelector(),
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the channel',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['update'],
			},
		},
		options: [
			{
				...internalChatCategoryOptionalSelector(),
				description: 'Category to assign the channel to. Leave empty (and add the field) to detach the current category.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the channel',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the channel',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['list'],
			},
		},
		options: [
			internalChatCategoryOptionalSelector(),
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'active',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Archived', value: 'archived' },
				],
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'text_channels',
				options: [
					{ name: 'Text Channels', value: 'text_channels' },
					{ name: 'Direct Messages', value: 'direct_messages' },
				],
			},
		],
	},
	{
		...internalChatMessageSelector,
		displayName: 'Mark Unread From Message',
		description: 'Mark the channel as unread starting from this message. Required: Chatwoot does not support marking a whole channel unread without a reference message.',
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['markUnread'],
			},
		},
	},
	{
		displayName: 'Typing Status',
		name: 'typingStatus',
		type: 'options',
		default: 'on',
		required: true,
		description: 'Whether to turn the typing indicator on or off',
		options: [
			{ name: 'On', value: 'on' },
			{ name: 'Off', value: 'off' },
		],
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['toggleTyping'],
			},
		},
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		description: 'Search query across channels, DMs, and messages',
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				...showOnlyForInternalChatChannel,
				operation: ['search'],
			},
		},
	},
];

export const internalChatChannelDescription: INodeProperties[] = [
	...internalChatChannelOperations,
	...internalChatChannelFields,
];

export { executeInternalChatChannelOperation } from './operations';
