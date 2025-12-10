import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { chatwootApiRequest } from '../../shared/transport';

export async function executeProfileOperation(
  context: IExecuteFunctions,
  operation: string,
): Promise<IDataObject | IDataObject[] | null> {
  if (operation === 'fetch') {
    return fetchProfile(context);
  }

  return null;
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

