import Hapi from '@hapi/hapi';
import studentLogin from './handlers/studentLogin';
import pageScript from './handlers/pageScript';
import { PoolConnection } from 'mariadb';

const getRouteList = (connection: PoolConnection): Hapi.ServerRoute<Hapi.ReqRefDefaults>[] => {
  return [
    {
      method: 'GET',
      path: '/',
      handler: async (
        // request: Hapi.Request<Hapi.ReqRefDefaults>,
        // h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
      ) => {
        return 'STEMSI.DEV';
      }
    },
    // Ping server
    {
      method: 'GET',
      path: '/ping',
      handler: () => {
        return 'OK';
      }
    },
    // Absensi siswa
    {
      method: 'POST',
      path: '/a/{daylock}',
      handler: studentLogin(connection)
    },
    // Dynamic script resources
    // {
    //   method: 'GET',
    //   path: '/ps/{daylock}/{fileCode}',
    //   handler: pageScript
    // }
  ];
}

export default getRouteList;