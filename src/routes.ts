import Hapi from '@hapi/hapi';
import studentLogin from './handlers/studentLogin';
import pageScript from './handlers/pageScript';
import checkLogin from './handlers/checkLogin';

const routeCollections: Hapi.ServerRoute<Hapi.ReqRefDefaults>[] = [
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
  // Absensi siswa
  {
    method: 'POST',
    path: '/a/{daylock}',
    handler: studentLogin
  },
  // Cek login
  {
    method: 'POST',
    path: '/c/{daylock}',
    handler: checkLogin
  },
  // Dynamic script resources
  {
    method: 'GET',
    path: '/ps/{daylock}/{fileCode}',
    handler: pageScript
  }
];

export default routeCollections;