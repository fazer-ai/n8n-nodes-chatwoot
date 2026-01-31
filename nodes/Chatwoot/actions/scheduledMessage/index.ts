import type { INodeProperties } from 'n8n-workflow';
import {
	accountSelector,
	conversationSelector,
	inboxSelector,
	scheduledMessageSelector,
} from '../../shared/descriptions';

const showOnlyForScheduledMessage = {
	resource: ['scheduledMessage'],
};

const scheduledMessageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForScheduledMessage,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new scheduled message',
				action: 'Create scheduled message',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a scheduled message',
				action: 'Delete scheduled message',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many scheduled messages for a conversation',
				action: 'Get scheduled messages',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing scheduled message',
				action: 'Update scheduled message',
			},
		],
		default: 'getAll',
	},
];

const scheduledMessageFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForScheduledMessage,
		},
	},
	{
		...inboxSelector,
		displayOptions: {
			show: showOnlyForScheduledMessage,
		},
	},
	{
		...conversationSelector,
		displayOptions: {
			show: showOnlyForScheduledMessage,
		},
	},
	{
		...scheduledMessageSelector,
		displayOptions: {
			show: {
				...showOnlyForScheduledMessage,
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		description: 'The text content of the scheduled message',
		displayOptions: {
			show: {
				...showOnlyForScheduledMessage,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Scheduled At',
		name: 'scheduledAt',
		type: 'dateTime',
		default: '',
		description: "ISO 8601 datetime when the message should be sent. Required when status is 'pending'.",
		displayOptions: {
			show: {
				...showOnlyForScheduledMessage,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'pending',
		required: true,
		description: "The status of the scheduled message. Use 'draft' to save without scheduling, 'pending' to schedule the message.",
		options: [
			{ name: 'Draft', value: 'draft' },
			{ name: 'Pending', value: 'pending' },
		],
		displayOptions: {
			show: {
				...showOnlyForScheduledMessage,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForScheduledMessage,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The text content of the scheduled message',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduled_at',
				type: 'dateTime',
				default: '',
				description: 'ISO 8601 datetime when the message should be sent',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'pending',
				description: "The status of the scheduled message. Use 'draft' to save without scheduling, 'pending' to schedule the message.",
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Pending', value: 'pending' },
				],
			},
		],
	},
];

export const scheduledMessageDescription: INodeProperties[] = [
	...scheduledMessageOperations,
	...scheduledMessageFields,
];

export { executeScheduledMessageOperation } from './operations';
