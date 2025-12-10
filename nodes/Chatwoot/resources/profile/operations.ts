import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest } from '../../shared/transport';

export async function executeProfileOperation(
  context: IExecuteFunctions,
  operation: string,
): Promise<IDataObject | IDataObject[] | undefined> {
  if(operation === 'fetch') {
    return fetchProfile(context);
  }
  else {
    return undefined;
  }
}

async function fetchProfile(
	context: IExecuteFunctions,
): Promise<IDataObject> {
	return (await chatwootApiRequest.call(
		context,
		'GET',
		'/api/v1/profile',
	)) as IDataObject;
}

