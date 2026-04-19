import type { INodeProperties } from 'n8n-workflow';
import { accountSelector, internalChatCategorySelector } from '../../shared/descriptions';

const showOnlyForInternalChatCategory = {
	resource: ['internalChatCategory'],
};

const internalChatCategoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInternalChatCategory,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new internal chat category',
				action: 'Create internal chat category',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an internal chat category',
				action: 'Delete internal chat category',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all internal chat categories',
				action: 'List internal chat categories',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an internal chat category',
				action: 'Update internal chat category',
			},
		],
		default: 'list',
	},
];

const internalChatCategoryFields: INodeProperties[] = [
	{
		displayName: 'Internal chat is only available on <a href="https://github.com/fazer-ai/chatwoot/pkgs/container/chatwoot" target="_blank">Chatwoot fazer.ai</a>',
		name: 'fazerAiNotice',
		type: 'notice',
		default: '',
		typeOptions: {
			theme: 'info',
		},
		displayOptions: {
			show: showOnlyForInternalChatCategory,
		},
	},
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForInternalChatCategory,
		},
	},
	{
		...internalChatCategorySelector,
		displayOptions: {
			show: {
				...showOnlyForInternalChatCategory,
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the category',
		displayOptions: {
			show: {
				...showOnlyForInternalChatCategory,
				operation: ['create'],
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
				...showOnlyForInternalChatCategory,
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Display position of the category',
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
				...showOnlyForInternalChatCategory,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the category',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Display position of the category',
			},
		],
	},
];

export const internalChatCategoryDescription: INodeProperties[] = [
	...internalChatCategoryOperations,
	...internalChatCategoryFields,
];

export { executeInternalChatCategoryOperation } from './operations';
