import Hapi from '@hapi/hapi';
import fs from 'fs/promises';
import { checkDaylock } from '../utils';

/**
 * 
 * @param request Hapi.Request<Hapi.ReqRefDefaults>
 * @param h Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
 * @returns any
 */
export default async function pageScript(
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
): Promise<string> {
  const { daylock, fileCode } = request.params;
  let result;
  
  try {
    switch (fileCode) {
      case 'lg':
        result = await fs.readFile('./static/lg.js');
    }
  } catch (error) {
    console.log(error);
  }

  if (result === undefined) {
    return '';
  }

  return result?.toString();
};