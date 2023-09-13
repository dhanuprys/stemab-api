import Hapi from '@hapi/hapi';
import loginUser from './handlers/loginUser';

const routeCollections: Hapi.ServerRoute<Hapi.ReqRefDefaults>[] = [
  {
    method: 'GET',
    path: '/',
    handler: async (
      request: Hapi.Request<Hapi.ReqRefDefaults>,
      h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
    ) => {
      return 'SERVICE TEST';
    }
  },
  {
    method: 'POST',
    path: '/a/{daylock}',
    handler: loginUser
  }
];

export default routeCollections;