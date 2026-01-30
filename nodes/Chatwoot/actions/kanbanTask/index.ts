/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';
import {
  accountSelector,
  kanbanBoardSelector,
  kanbanStepSelector,
  kanbanTaskSelector
} from '../../shared/descriptions';

const showOnlyForKanbanTask = {
	resource: ['kanbanTask'],
};

const kanbanTaskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForKanbanTask },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a kanban task',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task',
				action: 'Delete a kanban task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific task',
				action: 'Get a kanban task',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List tasks from a board',
				action: 'List kanban tasks',
			},
			{
				name: 'Move',
				value: 'move',
				description: 'Move a task to another step or position',
				action: 'Move a kanban task',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a task',
				action: 'Update a kanban task',
			},
		],
		default: 'create',
	},
];

const kanbanTaskFields: INodeProperties[] = [
	{
		...accountSelector,
		displayOptions: {
			show: { ...showOnlyForKanbanTask },
		},
	},
	{
		...kanbanBoardSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanTask,
				operation: ['create', 'delete'],
			},
		},
		typeOptions: {
			...kanbanBoardSelector.typeOptions,
			loadOptionsDependsOn: ['accountId'],
		},
	},
	{
		...kanbanBoardSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanTask,
				operation: ['get', 'list', 'move', 'update'],
			},
		},
		typeOptions: {
			...kanbanBoardSelector.typeOptions,
			loadOptionsDependsOn: ['accountId'],
		},
	},
	{
		...kanbanStepSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanTask,
				operation: ['create'],
			},
		},
		typeOptions: {
			...kanbanStepSelector.typeOptions,
			loadOptionsDependsOn: ['kanbanBoardId'],
		},
	},
	{
		...kanbanTaskSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanTask,
				operation: ['get', 'update', 'delete', 'move'],
			},
		},
		typeOptions: {
			...kanbanTaskSelector.typeOptions,
			loadOptionsDependsOn: ['kanbanBoardId'],
		},
	},
	{
		...kanbanStepSelector,
		displayOptions: {
			show: {
				...showOnlyForKanbanTask,
				operation: ['move'],
			},
		},
		typeOptions: {
			...kanbanStepSelector.typeOptions,
			loadOptionsDependsOn: ['kanbanBoardId'],
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		description: 'Title of the task',
		displayOptions: {
			show: {
				...showOnlyForKanbanTask,
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
				...showOnlyForKanbanTask,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title of the task',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Detailed description of the task',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 'medium',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'High', value: 'high' },
					{ name: 'Urgent', value: 'urgent' },
				],
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Start date of the task',
			},
			{
				displayName: 'End Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				description: 'End/due date of the task',
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Agents',
				name: 'assigned_agent_ids',
				description: 'Agents assigned to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadKanbanBoardAgentsOptions',
					loadOptionsDependsOn: ['kanbanBoardId'],
				},
				default: [],
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Labels',
				name: 'labels',
				description: 'Labels assigned to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadLabelsWithTitleValueOptions',
					loadOptionsDependsOn: ['accountId'],
				},
				default: [],
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Conversations',
				name: 'conversation_ids',
				description: 'Conversations linked to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadKanbanBoardConversationsOptions',
					loadOptionsDependsOn: ['kanbanBoardId'],
				},
				default: [],
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Contacts',
				name: 'contact_ids',
				description: 'Contacts linked to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadContactsOptions',
					loadOptionsDependsOn: ['accountId'],
				},
				default: [],
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
				...showOnlyForKanbanTask,
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Detailed description of the task',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 'medium',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'High', value: 'high' },
					{ name: 'Urgent', value: 'urgent' },
				],
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Start date of the task',
			},
			{
				displayName: 'End Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				description: 'End/due date of the task',
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Agents',
				name: 'assigned_agent_ids',
				description: 'Agents assigned to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadKanbanBoardAgentsOptions',
					loadOptionsDependsOn: ['kanbanBoardId'],
				},
				default: [],
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Labels',
				name: 'labels',
				description: 'Labels assigned to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadLabelsWithTitleValueOptions',
					loadOptionsDependsOn: ['accountId'],
				},
				default: [],

			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Conversations',
				name: 'conversation_ids',
				description: 'Conversations linked to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadKanbanBoardConversationsOptions',
					loadOptionsDependsOn: ['kanbanBoardId'],
				},
				default: [],
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Contacts',
				name: 'contact_ids',
				description: 'Contacts linked to the task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'loadContactsOptions',
					loadOptionsDependsOn: ['accountId'],
				},
				default: [],
			}
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
				...showOnlyForKanbanTask,
				operation: ['list'],
			},
		},
		options: [
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Step',
				name: 'board_step_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadKanbanStepsOptions',
					loadOptionsDependsOn: ['kanbanBoardId'],
				},
				default: '',
				description: 'Filter by step. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{ name: 'All', value: '' },
					{ name: 'Urgent', value: 'urgent' },
					{ name: 'High', value: 'high' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'Low', value: 'low' },
				],
				description: 'Filter by priority',
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Agent',
				name: 'agent_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadAgentsOptions',
					loadOptionsDependsOn: ['accountId'],
				},
				default: '',
				description: 'Filter by assigned agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Inbox',
				name: 'inbox_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadInboxesOptions',
					loadOptionsDependsOn: ['accountId'],
				},
				default: '',
				description: 'Filter by inbox. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Sort By',
				name: 'sort',
				type: 'options',
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{ name: 'Default', value: '' },
					{ name: 'Title', value: 'title' },
					{ name: 'Last Activity', value: 'updated_at' },
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Priority', value: 'priority' },
					{ name: 'Due Date', value: 'due_date' },
				],
				description: 'Sort field',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: 'asc',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				description: 'Sort order',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Page number for pagination (requires step to be selected)',
			},
			{
				displayName: 'Per Page',
				name: 'per_page',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 25,
				description: 'Number of items per page (max 100)',
			},
		],
	},
];

export const kanbanTaskDescription: INodeProperties[] = [
	...kanbanTaskOperations,
	...kanbanTaskFields,
];

export { executeKanbanTaskOperation } from './operations';
