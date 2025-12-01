import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

async function getAccountProfile(this: IExecuteFunctions): Promise<string> {
	const credentials = await this.getCredentials('chatwootApi');
	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'chatwootApi', {
		method: 'GET',
		baseURL: credentials.url as string,
		url: '/api/v1/profile',
	});
	if (!response.accounts || !Array.isArray(response.accounts) || response.accounts.length === 0) {
		throw new ApplicationError('No ChatWoot accounts found in profile response.');
	}

	return response.accounts;
}

export class Chatwoot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ChatWoot',
		name: 'chatwoot',
		icon: 'file:../../icons/chatwoot.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with the ChatWoot API',
		defaults: {
			name: 'ChatWoot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'chatwootApi',
				required: true,
			},
		],
		codex: {
			categories: ['Messaging', 'Customer Support'],
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Account Info',
						value: 'getAccount',
						description: 'Get information about the connected account',
						action: 'Get account information',
					},
					{
						name: 'List Conversations',
						value: 'listConversations',
						description: 'List conversations from an inbox',
						action: 'List conversations from an inbox',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a new message in a conversation',
						action: 'Send a new message in a conversation',
					},
				],
				default: 'getAccount',
				required: true,
				description: 'Choose the operation to execute on the ChatWoot API',
			},
			// Additional fields per operation will be added later
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// At this early stage, no operation is executed yet.
		// Future code will use this.getNodeParameter('operation', i) to select the behavior.
		const account = await getAccountProfile.call(this);
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			// Based on the property 'operation', different logic will be implemented
			switch (this.getNodeParameter('operation', 0)) {
				case 'getAccount':
						returnData.push({
							json: {
								account,
							},
						});
					break;
				case 'listConversations':
								returnData.push({
									json: {
										message: 'No operation has been implemented yet.',
										input: items[i].json,
									},
								});
					break;
				case 'sendMessage':
						returnData.push({
							json: {
								message: 'No operation has been implemented yet.',
								input: items[i].json,
							},
						});

					break;
				default:
					throw new ApplicationError(`The operation "${this.getNodeParameter('operation', 0)}" is not supported!`);
			}
		}
		return [returnData];
	}
}
