import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ChatWootApi implements ICredentialType {
	name = 'chatwootApi';
	displayName = 'ChatWoot API';
	documentationUrl = 'https://developers.chatwoot.com/api-doc';

	properties: INodeProperties[] = [
		{
			displayName: 'ChatWoot API URL',
			name: 'url',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://app.chatwoot.com',
			description:
				'Base URL of your Chatwoot instance. E.g.: https://app.chatwoot.com or https://chat.yourdomain.com',
		},
		{
			displayName: 'Notice',
			name: 'tokenInfo',
			type: 'notice',
			default: '',
			description:
				'There are <a href="https://www.chatwoot.com/docs/product/api" target="_blank">different types of access tokens</a> in Chatwoot. This field uses a <b>Personal Access Token</b>, obtained from your profile. Make sure to use the correct token.',
			typeOptions: { password: true },
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			default: '',
			required: true,
			placeholder: '00000000-0000-0000-0000-000000000000',
			typeOptions: {
				password: true,
			},
			description: 'Personal Access Token from your Chatwoot account. Generate it in Profile > Access Tokens.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Api-Access-Token': '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v1/profile',
		},
	};

	icon: Icon = 'file:../icons/chatwoot.svg';
}


