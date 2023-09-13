import Hapi, { ReqRefDefaults } from '@hapi/hapi';

const init = async () => {
  const server = Hapi.server({
    host: '0.0.0.0',
    port: 3000
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (
      request: Hapi.Request<ReqRefDefaults>,
      h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
    ) => {
      return 'Hello World!';
    }
  })

  await server.start();

  console.log('Server started!');
}

init();