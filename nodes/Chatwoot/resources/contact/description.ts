import type { INodeProperties } from 'n8n-workflow';
import {
	accountSelector,
	contactSelector,
	customAttributesField,
	responseFilterFields,
} from '../../shared/descriptions';

const showOnlyForContact = {
	resource: ['contact'],
};

const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForContact,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific contact',
				action: 'Get contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for contacts',
				action: 'Search contacts',
			},
			{
				name: 'Set Custom Attribute',
				value: 'setCustomAttribute',
				description: 'Set custom attributes on a contact',
				action: 'Set custom attribute on contact',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update contact',
			},
		],
		default: 'getAll',
	},
];

const contactFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForContact,
		},
	},
	{
		...contactSelector,
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['get', 'update', 'delete', 'setCustomAttribute'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the contact',
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Email of the contact',
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		default: '',
		description: 'Phone number of the contact (with country code)',
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		required: true,
		description: 'Search query to find contacts (searches in name, email, phone)',
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['getAll', 'search'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['getAll', 'search'],
				returnAll: [false],
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
				...showOnlyForContact,
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Avatar URL',
				name: 'avatar_url',
				type: 'string',
				default: '',
				description: 'URL of the contact avatar',
			},
			{
				...customAttributesField,
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email of the contact (for update)',
			},
			{
				displayName: 'Identifier',
				name: 'identifier',
				type: 'string',
				default: '',
				description: 'External identifier for the contact (unique per inbox)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the contact (for update)',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Phone number of the contact (for update)',
			},
		],
	},
	{
		displayName: 'Custom Attributes',
		name: 'customAttributes',
		type: 'json',
		default: '{}',
		required: true,
		description: 'Custom attributes as JSON object (key-value pairs)',
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['setCustomAttribute'],
			},
		},
	},
	{
		...responseFilterFields,
		displayOptions: {
			show: {
				...showOnlyForContact,
				operation: ['get', 'getAll', 'search', 'setCustomAttribute'],
			},
		},
	},
];

export const contactDescription: INodeProperties[] = [
	...contactOperations,
	...contactFields,
];
