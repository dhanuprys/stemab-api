import Hapi from '@hapi/hapi';
import studentLogin from './handlers/studentLogin';
import { PoolConnection } from 'mariadb';

const getRouteList = (connection: PoolConnection): Hapi.ServerRoute<Hapi.ReqRefDefaults>[] => {
  return [
    {
      method: 'GET',
      path: '/public/{file*}',
      handler: {
        directory: { 
          path: 'public'
        }
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
    {
      method: 'GET',
      path: '/restart',
      handler: () => {
        process.exit(1);
      }
    }
    // Dynamic script resources
    // {
    //   method: 'GET',
    //   path: '/ps/{daylock}/{fileCode}',
    //   handler: pageScript
    // }
  ];
}

export default getRouteList;