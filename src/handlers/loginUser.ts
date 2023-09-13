import Hapi from '@hapi/hapi';
import { checkDaylock, parseNISN } from '../utils';
import Database from '../database';
import UserModel from '../models/userModel';

/**
 * 
 * @param request Hapi.Request<Hapi.ReqRefDefaults>
 * @param h Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
 * @returns any
 */
export default async function loginUser(
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) {
  const { daylock: userDaylock } = request.params;
  const payload: string = <string>request.payload;
  const user = new UserModel(
    new Database()
  );
  const realNISN = parseNISN(payload);
  await user.setup();

  // Memastikan input dari client adalah sebuah body raw (string)
  if (typeof payload !== 'string') {
    return 'Rejected#1';
  }

  // Jika NISN tidak valid maka request akan ditolak
  if (realNISN === null) {
    return 'Rejected#2';
  }

  // Cek apakah kunci akses sudah simetris antara client dan server
  if (!checkDaylock(userDaylock)) {
    return 'Rejected#3';
  }
 
  // Cek apakah user sebelumnya sudah melakukan login atau belum
  if (await user.isLogin(userDaylock, realNISN)) {
    return 'Already';
  }

  // Menambahkan user ke daftar login
  if (await user.login(userDaylock, '27492782')) {
    return 'Success';
  }
  
  return 'OKE';
}