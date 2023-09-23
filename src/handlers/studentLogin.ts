import Hapi from '@hapi/hapi';
import { LogStatus, LoginCredential, checkDaylock, parseNISNLogin, printLog } from '../utils';
// import Database from '../database';
import PresenceModel, { DatabaseBlueprint } from '../models/PresenceModel';
import { RawRESTResponse, createRESTResponse } from '../response';
import StudentModel from '../models/UserModel';
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
      printLog(LogStatus.error, 'Invalid payload');
      return createRESTResponse(false, 'rejected');
    }
  
    // Jika NISN tidak valid maka request akan ditolak
    if (userCredential === null) {
      await login.close();
      await student.close();
      printLog(LogStatus.error, 'User credential is invalid');
      return createRESTResponse(false, 'rejected');
    }
  
    // Cek apakah kunci akses sudah simetris antara client dan server
    if (!checkDaylock(userDaylock, true)) {
      await login.close();
      await student.close();
      printLog(LogStatus.warning, 'Invalid daylock');
      return createRESTResponse(false, 'rejected');
    }
  
    // Cek apakah NISN dan NIS yang dimasukkan siswa ada pada database atau tidak
    let userAvailability = await student.isAvailable(userCredential as LoginCredential);
    if (userAvailability === null) {
      await login.close();
      await student.close();
      printLog(LogStatus.warning, 'User not found', `USER:"${userCredential.username}"`, `PASS:"${userCredential.password}"`);
      return createRESTResponse(false, 'unknown');
    }

    // Jika user tersebut adalah seorang admin maka tidak akan dimasukkan ke dalam
    // tabel presensi
    if (userAvailability.admin === 1) {
      await student.close();
      await login.close();

      printLog(LogStatus.success, userAvailability.name, 'logged in as admin');

      // @ts-ignore
      return createRESTResponse(
        true,
        'already',
        userAvailability
      );
    }
   
    // Cek apakah user sebelumnya sudah melakukan login atau belum
    let loginStatus = await login.isLogin(userDaylock, userCredential.username);
    if (loginStatus !== null) {
      await student.close();
      await login.close();

      printLog(LogStatus.success, userAvailability.username, userAvailability.password, userAvailability.name);
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
    loginStatus = await login.login(userDaylock, userCredential.username);
    if (loginStatus !== null) {
      await login.close();
      await student.close();

      printLog(LogStatus.success, userAvailability.username, userAvailability.password, userAvailability.name);
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

    printLog(LogStatus.error, 'Failed to process request');
  
    return createRESTResponse(false, 'failed');
  }
}