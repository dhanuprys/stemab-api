import Hapi from '@hapi/hapi';
import { LoginCredential, checkDaylock, parseNISNLogin } from '../utils';
import Database from '../database';
import PresenceModel, { DatabaseBlueprint } from '../models/PresenceModel';
import { RawRESTResponse, createRESTResponse } from '../response';
import StudentModel from '../models/StudentModel';
import { PoolConnection } from 'mariadb';

/**
 * 
 * @param request Hapi.Request<Hapi.ReqRefDefaults>
 * @param h Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
 * @returns any
 */


export default function wrapper(connection: PoolConnection): (request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>) => Promise<RawRESTResponse<DatabaseBlueprint>> {
  return async function studentLogin(
    request: Hapi.Request<Hapi.ReqRefDefaults>,
    h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
  ): Promise<RawRESTResponse<DatabaseBlueprint>> {
    const { daylock: userDaylock } = request.params;
    const payload: string = <string>request.payload;
    const login: PresenceModel = new PresenceModel(connection);
    const student: StudentModel = new StudentModel(connection);
    const userCredential = parseNISNLogin(payload);
  
    // Memastikan input dari client adalah sebuah body raw (string)
    if (typeof payload !== 'string') {
      await login.close();
      await student.close();
      return createRESTResponse(false, 'rejected');
    }
  
    // Jika NISN tidak valid maka request akan ditolak
    if (userCredential === null) {
      await login.close();
      await student.close();
      return createRESTResponse(false, 'rejected');
    }
  
    // Cek apakah kunci akses sudah simetris antara client dan server
    if (!checkDaylock(userDaylock, true)) {
      await login.close();
      await student.close();
      return createRESTResponse(false, 'rejected');
    }
  
    // Cek apakah NISN dan NIS yang dimasukkan siswa ada pada database atau tidak
    let userAvailability = await student.isAvailable(userCredential as LoginCredential);
    if (userAvailability === null) {
      await login.close();
      await student.close();
      return createRESTResponse(false, 'unknown');
    }
   
    // Cek apakah user sebelumnya sudah melakukan login atau belum
    let loginStatus = await login.isLogin(userDaylock, userCredential.nisn);
    if (loginStatus !== null) {
      await student.close();
      await login.close();
      return createRESTResponse(
        true,
        'already',
        {
          ...loginStatus,
          name: userAvailability.name
        }
      );
    }
  
    // Menambahkan user ke daftar login
    loginStatus = await login.login(userDaylock, userCredential.nisn);
    if (loginStatus !== null) {
      await login.close();
      await student.close();
      return createRESTResponse(
        true,
        'created',
        {
          ...loginStatus,
          name: userAvailability.name
        }
      );
    }
    
    await login.close();
    await student.close();
  
    return createRESTResponse(false, 'failed');
  }
}