import Hapi from '@hapi/hapi';
import { checkDaylock, parseNISN } from '../utils';
import Database from '../database';
import UserModel, { DatabaseBlueprint } from '../models/userModel';
import { RawRESTResponse } from '../response';

/**
 * 
 * @param request Hapi.Request<Hapi.ReqRefDefaults>
 * @param h Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
 * @returns any
 */
export default async function loginUser(
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
): Promise<RawRESTResponse<DatabaseBlueprint>> {
  const { daylock: userDaylock } = request.params;
  const payload: string = <string>request.payload;
  const user = new UserModel(
    new Database()
  );
  const realNISN = parseNISN(payload);
  await user.setup();

  // Memastikan input dari client adalah sebuah body raw (string)
  if (typeof payload !== 'string') {
    return {
      status: false,
      message: 'rejected#1'
    };
  }

  // Jika NISN tidak valid maka request akan ditolak
  // if (realNISN === null) {
  //   return {
  //     status: false, 
  //     mesasge: 'rejected#2'
  //   };
  // }

  // Cek apakah kunci akses sudah simetris antara client dan server
  if (!checkDaylock(userDaylock, true)) {
    return {
      status: false,
      message: 'rejected#2'
    }
  }
 
  // Cek apakah user sebelumnya sudah melakukan login atau belum
  let loginStatus = await user.isLogin(userDaylock, '2749278');
  if (loginStatus !== null) {
    return {
      status: true,
      message: 'already',
      data: loginStatus
    }
  }

  // Menambahkan user ke daftar login
  loginStatus = await user.login(userDaylock, '274927820');
  if (loginStatus !== null) {
    return {
      status: true,
      message: 'created',
      data: loginStatus
    };
  }
  
  return {
    status: false,
    message: 'failed'
  };
}