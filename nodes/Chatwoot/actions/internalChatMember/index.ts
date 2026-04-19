import type { INodeProperties } from 'n8n-workflow';
import {
	accountSelector,
	internalChatChannelSelector,
	internalChatMemberSelector,
	internalChatNotice,
} from '../../shared/descriptions';

const showOnlyForInternalChatMember = {
	resource: ['internalChatMember'],
};

const internalChatMemberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInternalChatMember,
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add one or more members to a channel',
				action: 'Add internal chat channel members',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all members of a channel',
				action: 'List internal chat channel members',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove a member from a channel',
				action: 'Remove internal chat channel member',
			},
			{
				name: 'Update',
				value: 'update',
				description: "Update a member's settings (mute, favorite, hidden)",
				action: 'Update internal chat channel member',
			},
		],
		default: 'list',
	},
];

const internalChatMemberFields: INodeProperties[] = [
	{
		...internalChatNotice,
		displayOptions: {
			show: showOnlyForInternalChatMember,
		},
	},
	{
		...accountSelector,
		displayOptions: {
			show: showOnlyForInternalChatMember,
		},
	},
	{
		...internalChatChannelSelector,
		displayOptions: {
			show: showOnlyForInternalChatMember,
		},
	},
	{
		...internalChatMemberSelector,
		displayOptions: {
			show: {
				...showOnlyForInternalChatMember,
				operation: ['update', 'remove'],
			},
		},
	},
	{
		displayName: 'User Names or IDs',
		name: 'userIds',
		type: 'multiOptions',
		default: [],
		required: true,
		description: 'Users to add as channel members. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'loadAgentsOptions',
		},
		displayOptions: {
			show: {
				...showOnlyForInternalChatMember,
				operation: ['add'],
			},
		},
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		default: 'member',
		description: 'Role to assign to the new members. Only account administrators can promote to admin; otherwise the role is silently coerced to member.',
		options: [
			{ name: 'Admin', value: 'admin' },
			{ name: 'Member', value: 'member' },
		],
		displayOptions: {
			show: {
				...showOnlyForInternalChatMember,
				operation: ['add'],
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
				...showOnlyForInternalChatMember,
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Favorited',
				name: 'favorited',
				type: 'boolean',
				default: false,
				description: 'Whether the channel is favorited by this member',
			},
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether the channel is hidden for this member (used to close DMs)',
			},
			{
				displayName: 'Muted',
				name: 'muted',
				type: 'boolean',
				default: false,
				description: 'Whether the channel is muted for this member',
			},
		],
	},
];

export const internalChatMemberDescription: INodeProperties[] = [
	...internalChatMemberOperations,
	...internalChatMemberFields,
];

export { executeInternalChatMemberOperation } from './operations';
