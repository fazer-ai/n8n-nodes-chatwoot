import type { INodeProperties } from 'n8n-workflow';
import {
  accountSelector,
  kanbanBoardSelector,
  kanbanProductSelector
} from '../../shared/descriptions';

const showOnlyForKanbanProduct = {
	resource: ['kanbanProduct'],
};

const kanbanProductOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForKanbanProduct },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new product in a board',
				action: 'Create a kanban product',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product from a board',
				action: 'Delete a kanban product',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List products from a board',
				action: 'List kanban products',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product in a board',
				action: 'Update a kanban product',
			},
		],
		default: 'create',
	},
];

const kanbanProductFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: { ...showOnlyForKanbanProduct },
		},
	},
	{
		...kanbanBoardSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanProduct,
				operation: ['create', 'list', 'update', 'delete'],
			},
		},
	},
	{
		...kanbanProductSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanProduct,
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
		description: 'Name of the product',
		displayOptions: {
			show: {
				...showOnlyForKanbanProduct,
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
				...showOnlyForKanbanProduct,
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether the product is archived',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Description of the product',
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				typeOptions: {
					minValue: 0,
					numberPrecision: 2,
				},
				default: 0,
				description: 'Unit price of the product',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateProductFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForKanbanProduct,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether the product is archived',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'New description for the product',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the product',
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				typeOptions: {
					minValue: 0,
					numberPrecision: 2,
				},
				default: 0,
				description: 'New unit price for the product',
			},
		],
	},
	{
		displayName: 'List Filters',
		name: 'listFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForKanbanProduct,
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether to show only archived products',
			},
		],
	},
];

export const kanbanProductDescription: INodeProperties[] = [
	...kanbanProductOperations,
	...kanbanProductFields,
];

export { executeKanbanProductOperation } from './operations';
