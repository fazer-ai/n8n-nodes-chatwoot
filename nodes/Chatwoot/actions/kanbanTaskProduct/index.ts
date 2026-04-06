/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';
import {
  accountSelector,
  kanbanBoardSelector,
  kanbanTaskSelector,
  kanbanTaskProductSelector,
} from '../../shared/descriptions';

const showOnlyForKanbanTaskProduct = {
	resource: ['kanbanTaskProduct'],
};

const kanbanTaskProductOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForKanbanTaskProduct },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a product to a task',
				action: 'Create a kanban task product',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a product from a task',
				action: 'Delete a kanban task product',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List products attached to a task',
				action: 'List kanban task products',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product on a task',
				action: 'Update a kanban task product',
			},
		],
		default: 'create',
	},
];

const kanbanTaskProductFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: { ...showOnlyForKanbanTaskProduct },
		},
	},
	{
		...kanbanBoardSelector,
		displayOptions: {
			show: { ...showOnlyForKanbanTaskProduct },
		},
		typeOptions: {
			...kanbanBoardSelector.typeOptions,
			loadOptionsDependsOn: ['accountId'],
		},
	},
	{
		...kanbanTaskSelector,
		displayOptions: {
			show: { ...showOnlyForKanbanTaskProduct },
		},
		typeOptions: {
			...kanbanTaskSelector.typeOptions,
			loadOptionsDependsOn: ['kanbanBoardId'],
		},
	},
	{
		...kanbanTaskProductSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanTaskProduct,
				operation: ['update', 'delete'],
			},
		},
		typeOptions: {
			...kanbanTaskProductSelector.typeOptions,
			loadOptionsDependsOn: ['kanbanTaskId'],
		},
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'number',
		default: 0,
		required: true,
		description: 'ID of the product from the board catalog',
		displayOptions: {
			show: {
				...showOnlyForKanbanTaskProduct,
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
				...showOnlyForKanbanTaskProduct,
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 1,
				description: 'Quantity of the product',
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Unit price override - defaults to product catalog price',
			},
			{
				displayName: 'Discount Percentage',
				name: 'discount_percentage',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 0,
				description: 'Discount percentage to apply',
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
				...showOnlyForKanbanTaskProduct,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 1,
				description: 'Quantity of the product',
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Unit price override',
			},
			{
				displayName: 'Discount Percentage',
				name: 'discount_percentage',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 0,
				description: 'Discount percentage to apply',
			},
		],
	},
];

export const kanbanTaskProductDescription: INodeProperties[] = [
	...kanbanTaskProductOperations,
	...kanbanTaskProductFields,
];

export { executeKanbanTaskProductOperation } from './operations';
