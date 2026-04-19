import type { INodeProperties } from 'n8n-workflow';
import {
	accountSelector,
	internalChatChannelSelector,
	internalChatMessageOptionalSelector,
	internalChatMessageSelector,
	internalChatNotice,
} from '../../shared/descriptions';

const showOnlyForInternalChatMessage = {
	resource: ['internalChatMessage'],
};

const sharedMessageOptionFields = (): INodeProperties[] => [
	{
		displayName: 'Also Send in Channel',
		name: 'also_send_in_channel',
		type: 'boolean',
		default: false,
		description: 'Whether to mirror a thread reply into the main channel view. Only takes effect when Parent Message is set.',
	},
	{
		displayName: 'Echo ID',
		name: 'echo_id',
		type: 'string',
		default: '',
		description: 'Client-generated ID for optimistic updates',
	},
	internalChatMessageOptionalSelector({
		name: 'parent_id',
		displayName: 'Parent Message',
		description: 'Parent message for threaded replies',
	}),
];

const internalChatMessageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInternalChatMessage,
		},
		options: [
			{
				name: 'Add Reaction',
				value: 'addReaction',
				description: 'Add an emoji reaction to a message',
				action: 'Add reaction to internal chat message',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Send a new message to a channel',
				action: 'Create internal chat message',
			},
			{
				name: 'Create Poll',
				value: 'createPoll',
				description: 'Create a new poll in a channel',
				action: 'Create internal chat poll',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete (soft-delete) a message',
				action: 'Delete internal chat message',
			},
			{
				name: 'Delete Draft',
				value: 'deleteDraft',
				description: 'Delete the current user\'s draft in a channel',
				action: 'Delete internal chat draft',
			},
			{
				name: 'Get Thread',
				value: 'getThread',
				description: 'Get a message and its threaded replies',
				action: 'Get internal chat message thread',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List messages in a channel',
				action: 'List internal chat messages',
			},
			{
				name: 'List Drafts',
				value: 'listDrafts',
				description: 'List all drafts for the current user',
				action: 'List internal chat drafts',
			},
			{
				name: 'Pin',
				value: 'pin',
				description: 'Pin a message in a channel',
				action: 'Pin internal chat message',
			},
			{
				name: 'Remove Reaction',
				value: 'removeReaction',
				description: 'Remove an emoji reaction from a message',
				action: 'Remove reaction from internal chat message',
			},
			{
				name: 'Remove Vote',
				value: 'removeVote',
				description: "Remove the current user's vote from a poll",
				action: 'Remove vote from internal chat poll',
			},
			{
				name: 'Save Draft',
				value: 'saveDraft',
				description: 'Save or update the current user\'s draft in a channel',
				action: 'Save internal chat draft',
			},
			{
				name: 'Send File',
				value: 'sendFile',
				description: 'Send a message with a file attachment to a channel',
				action: 'Send file to internal chat channel',
			},
			{
				name: 'Unpin',
				value: 'unpin',
				description: 'Unpin a message in a channel',
				action: 'Unpin internal chat message',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update the content of a message',
				action: 'Update internal chat message',
			},
			{
				name: 'Vote',
				value: 'vote',
				description: 'Cast a vote on a poll option',
				action: 'Vote on internal chat poll',
			},
		],
		default: 'list',
	},
];

const operationsRequiringChannel = [
	'list',
	'create',
	'sendFile',
	'update',
	'delete',
	'pin',
	'unpin',
	'getThread',
	'createPoll',
	'saveDraft',
	'deleteDraft',
	'addReaction',
	'removeReaction',
];

const operationsRequiringMessageSelector = [
	'update',
	'delete',
	'pin',
	'unpin',
	'getThread',
	'addReaction',
	'removeReaction',
];

const internalChatMessageFields: INodeProperties[] = [
	{
		...internalChatNotice,
		displayOptions: {
			show: showOnlyForInternalChatMessage,
		},
	},
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForInternalChatMessage,
		},
	},
	{
		...internalChatChannelSelector,
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: operationsRequiringChannel,
			},
		},
	},
	{
		...internalChatMessageSelector,
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: operationsRequiringMessageSelector,
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		required: true,
		description: 'The content of the message',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['create', 'update', 'saveDraft'],
			},
		},
	},
	{
		displayName: 'Input Data Field Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: 'e.g. data',
		hint: 'The name of the input field containing the binary file data to be uploaded',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['sendFile'],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'fileCaption',
		type: 'string',
		default: '',
		description: 'Optional message text to send alongside the file',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['sendFile'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'sendFileOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['sendFile'],
			},
		},
		options: [
			...sharedMessageOptionFields(),
			{
				displayName: 'File Type',
				name: 'file_type',
				type: 'options',
				default: '',
				description: 'Override the attachment file type. Leave as Auto to detect from MIME.',
				options: [
					{ name: 'Audio', value: 'audio' },
					{ name: 'Auto', value: '' },
					{ name: 'File', value: 'file' },
					{ name: 'Image', value: 'image' },
					{ name: 'Video', value: 'video' },
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['create'],
			},
		},
		options: sharedMessageOptionFields(),
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'After',
				name: 'after',
				type: 'dateTime',
				default: '',
				description: 'Return messages created after this timestamp',
			},
			{
				displayName: 'Around (Message ID)',
				name: 'around',
				type: 'number',
				default: 0,
				description: 'Return messages around the given message ID',
			},
			{
				displayName: 'Before',
				name: 'before',
				type: 'dateTime',
				default: '',
				description: 'Return messages created before this timestamp',
			},
		],
	},
	{
		displayName: 'Emoji',
		name: 'emoji',
		type: 'string',
		default: '',
		required: true,
		description: 'The emoji to react with',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['addReaction'],
			},
		},
	},
	{
		displayName: 'Reaction ID',
		name: 'reactionId',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: {
			minValue: 1,
		},
		description: 'ID of the reaction to remove',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['removeReaction'],
			},
		},
	},
	{
		displayName: 'Question',
		name: 'question',
		type: 'string',
		default: '',
		required: true,
		description: 'The poll question',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['createPoll'],
			},
		},
	},
	{
		displayName: 'Poll Options',
		name: 'pollOptions',
		placeholder: 'Add Option',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		description: 'Poll options (minimum 2)',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['createPoll'],
			},
		},
		options: [
			{
				name: 'option',
				displayName: 'Option',
				values: [
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						description: 'The option text',
					},
					{
						displayName: 'Emoji',
						name: 'emoji',
						type: 'string',
						default: '',
						description: 'Optional emoji for the option',
					},
					{
						displayName: 'Image URL',
						name: 'image_url',
						type: 'string',
						default: '',
						description: 'Optional image URL for the option',
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'pollAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['createPoll'],
			},
		},
		options: [
			{
				displayName: 'Allow Revote',
				name: 'allow_revote',
				type: 'boolean',
				default: true,
				description: 'Whether users can change their vote',
			},
			{
				displayName: 'Expires At',
				name: 'expires_at',
				type: 'dateTime',
				default: '',
				description: 'When the poll expires (ISO 8601)',
			},
			{
				displayName: 'Multiple Choice',
				name: 'multiple_choice',
				type: 'boolean',
				default: false,
				description: 'Whether multiple options can be selected',
			},
			{
				displayName: 'Public Results',
				name: 'public_results',
				type: 'boolean',
				default: true,
				description: 'Whether vote results are publicly visible',
			},
		],
	},
	{
		displayName: 'Poll ID',
		name: 'pollId',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: {
			minValue: 1,
		},
		description: 'ID of the poll to vote on',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['vote', 'removeVote'],
			},
		},
	},
	{
		displayName: 'Option ID',
		name: 'voteOptionId',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: {
			minValue: 1,
		},
		description: 'ID of the poll option to vote for',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['vote'],
			},
		},
	},
	{
		displayName: 'Option ID',
		name: 'removeVoteOptionId',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description: 'ID of the specific vote to remove (for multiple-choice polls). Use 0 (the default) to remove all votes for this poll; set a positive option ID to remove only that vote.',
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['removeVote'],
			},
		},
	},
	{
		...internalChatMessageOptionalSelector({
			name: 'parent_id',
			displayName: 'Parent Message',
			description: 'Parent message for thread drafts. Leave empty for channel-level draft.',
		}),
		displayOptions: {
			show: {
				...showOnlyForInternalChatMessage,
				operation: ['saveDraft', 'deleteDraft'],
			},
		},
	},
];

export const internalChatMessageDescription: INodeProperties[] = [
	...internalChatMessageOperations,
	...internalChatMessageFields,
];

export { executeInternalChatMessageOperation } from './operations';
