import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
	chatwootApiRequest,
	getAccountId,
} from '../../shared/transport';
import { CustomAttributeOperation } from './types';

export async function executeCustomAttributeOperation(
	context: IExecuteFunctions,
	operation: CustomAttributeOperation,
	itemIndex: number,
): Promise<INodeExecutionData | INodeExecutionData[]> {
  switch (operation) {
    case 'create':
      return createCustomAttribute(context, itemIndex);
    case 'delete':
      return deleteCustomAttribute(context, itemIndex);
    case 'list':
      return listCustomAttributes(context, itemIndex);
  }
}

async function createCustomAttribute(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);

	const attributeModel = context.getNodeParameter('attributeModel', itemIndex) as string;
	const attributeDisplayName = context.getNodeParameter('attributeDisplayName', itemIndex) as string;
	const attributeType = context.getNodeParameter('attributeType', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

	const displayTypeMap: Record<string, number> = {
		text: 0,
		number: 1,
		currency: 2,
		percent: 3,
		link: 4,
		date: 5,
		list: 6,
		checkbox: 7,
	};

	const customKey = additionalFields.attributeKey as string | undefined;
	const attributeKey = customKey?.trim()
		|| String(attributeDisplayName)
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '_')
			.replace(/^_+|_+$/g, '');

	const body: IDataObject = {
		attribute_display_name: attributeDisplayName,
		attribute_key: attributeKey,
		attribute_display_type: displayTypeMap[attributeType] ?? 0,
		attribute_model: attributeModel === 'conversation_attribute' ? 0 : 1,
	};

	const attributeValuesRaw = additionalFields.attributeValues as string | string[] | undefined;
	if (attributeValuesRaw) {
		const parsed = typeof attributeValuesRaw === 'string'
			? JSON.parse(attributeValuesRaw) as unknown
			: attributeValuesRaw;

		if (Array.isArray(parsed) && parsed.length) {
			body.attribute_values = parsed.map(String);
		}
	}

	if (additionalFields.attributeDescription) {
		body.attribute_description = additionalFields.attributeDescription;
	}

	if (attributeType === 'text') {
		if (additionalFields.regexPattern) {
			body.regex_pattern = additionalFields.regexPattern;
		}
		if (additionalFields.regexCue) {
			body.regex_cue = additionalFields.regexCue;
		}
	}

	const result = await chatwootApiRequest.call(
		context,
		'POST',
		`/api/v1/accounts/${accountId}/custom_attribute_definitions`,
		body,
	) as IDataObject;

	return { json: result };
}

async function listCustomAttributes(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const accountId = getAccountId.call(context, itemIndex);
	const attributeModel = context.getNodeParameter('attributeModel', itemIndex);

	const query: IDataObject = {
		attribute_model: attributeModel,
	};

	const result = await chatwootApiRequest.call(
		context,
		'GET',
		`/api/v1/accounts/${accountId}/custom_attribute_definitions`,
		undefined,
		query,
	) as IDataObject[];

	return result.map((attr) => ({ json: attr }));
}

async function deleteCustomAttribute(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const accountId = getAccountId.call(context, itemIndex);
	const attributeKey = context.getNodeParameter('attributeKeyToDelete', itemIndex);

	const result = await chatwootApiRequest.call(
		context,
		'DELETE',
		`/api/v1/accounts/${accountId}/custom_attribute_definitions/${attributeKey}`,
	) as IDataObject;

	return { json: result };
}
