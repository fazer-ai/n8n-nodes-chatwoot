import type { INodeProperties } from 'n8n-workflow';
import { accountSelector } from '../../shared/descriptions';

const showOnlyForCustomAttribute = {
	resource: ['customAttribute'],
};

const customAttributeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCustomAttribute,
		},
		options: [
			{
				name: 'Create Custom Attribute',
				value: 'create',
				description: 'Create a custom attribute definition',
				action: 'Create custom attribute definition',
			},
			{
				name: 'Delete Custom Attribute',
				value: 'delete',
				description: 'Delete a custom attribute definition',
				action: 'Delete custom attribute definition',
			},
			{
				name: 'List Custom Attributes',
				value: 'list',
				description: 'List all custom attribute definitions',
				action: 'List custom attribute definitions',
			},
		],
		default: 'create',
	},
];

const customAttributeFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: {
				...showOnlyForCustomAttribute,
				operation: ['create', 'list', 'delete'],
			},
		},
	},
	{
		displayName: 'Attribute Model',
		name: 'attributeModel',
		type: 'options',
		default: 'contact_attribute',
		required: true,
		options: [
			{ name: 'Contact Attribute', value: 'contact_attribute' },
			{ name: 'Conversation Attribute', value: 'conversation_attribute' },
			{ name: 'Task Attribute', value: 'task_attribute' },
		],
		displayOptions: {
			show: {
				...showOnlyForCustomAttribute,
				operation: ['create', 'list', 'delete'],
			},
		},
	},
	{
		displayName: 'Attribute Display Name',
		name: 'attributeDisplayName',
		type: 'string',
		default: '',
		required: true,
		description: 'Display name of the custom attribute',
		displayOptions: {
			show: {
				...showOnlyForCustomAttribute,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Attribute Type',
		name: 'attributeType',
		type: 'options',
		default: 'text',
		options: [
			{ name: 'Checkbox', value: 'checkbox' },
			{ name: 'Currency', value: 'currency' },
			{ name: 'Date', value: 'date' },
			{ name: 'Link', value: 'link' },
			{ name: 'List', value: 'list' },
			{ name: 'Number', value: 'number' },
			{ name: 'Percent', value: 'percent' },
			{ name: 'Text', value: 'text' },
		],
		displayOptions: {
			show: {
				...showOnlyForCustomAttribute,
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
				...showOnlyForCustomAttribute,
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Attribute Description',
				name: 'attributeDescription',
				type: 'string',
				default: '',
				description: 'Description of the custom attribute',
			},
			{
				displayName: 'Attribute Key',
				name: 'attributeKey',
				type: 'string',
				default: '',
				description: 'Unique key for the attribute. If left empty, a key will be auto-generated from the display name.',
			},
			{
				displayName: 'List Values',
				name: 'attributeValues',
				type: 'json',
				default: '[]',
				description: 'Values for the List attribute type as a JSON array (e.g. ["value1", "value2"])',
			},
			{
				displayName: 'Regex Cue',
				name: 'regexCue',
				type: 'string',
				default: '',
				description: 'Message shown when the regex pattern is not matched (only for text type)',
			},
			{
				displayName: 'Regex Pattern',
				name: 'regexPattern',
				type: 'string',
				default: '',
				description: 'Regex pattern used to validate the attribute value (only for text type)',
			},
		],
	},
	{
		displayName: 'Attribute',
		name: 'attributeKeyToDelete',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Select the custom attribute to delete',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select an attribute...',
				typeOptions: {
					searchListMethod: 'searchCustomAttributeDefinitions',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 1',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9]*$',
							errorMessage: 'The ID must be a number',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				...showOnlyForCustomAttribute,
				operation: ['delete'],
			},
		},
	},
];

export const customAttributeDescription: INodeProperties[] = [
	...customAttributeOperations,
	...customAttributeFields,
];

export { executeCustomAttributeOperation } from './operations';
