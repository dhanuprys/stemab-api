import Hapi from '@hapi/hapi';
import { LoginCredential, checkDaylock, parseNISNLogin } from '../utils';
import Database from '../database';
import PresenceModel, { DatabaseBlueprint } from '../models/PresenceModel';
import { RawRESTResponse } from '../response';
import StudentModel from '../models/StudentModel';

/**
 * 
 * @param request Hapi.Request<Hapi.ReqRefDefaults>
 * @param h Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
 * @returns any
 */
export default async function studentLogin(
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
): Promise<RawRESTResponse<DatabaseBlueprint>> {
  const { daylock: userDaylock } = request.params;
  const payload: string = <string>request.payload;
  const database = new Database();
  const login: PresenceModel = new PresenceModel(database);
  const student: StudentModel = new StudentModel(database);
  const userCredential = parseNISNLogin(payload);
  await login.setup();

  // Memastikan input dari client adalah sebuah body raw (string)
  if (typeof payload !== 'string') {
    return {
      status: false,
      message: 'rejected#1'
    };
  }

  // Jika NISN tidak valid maka request akan ditolak
  // if (userCredential === null) {
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

  let userAvailability = await student.isValid(userCredential as LoginCredential);
  if (!userAvailability) {
    return {
      status: false,
      message: 'unknown'
    }
  }
 
  // Cek apakah user sebelumnya sudah melakukan login atau belum
  let loginStatus = await login.isLogin(userDaylock, '2749278');
  if (loginStatus !== null) {
    return {
      status: true,
      message: 'already',
      data: loginStatus
    }
  }

  // Menambahkan user ke daftar login
  loginStatus = await login.login(userDaylock, '274927820');
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