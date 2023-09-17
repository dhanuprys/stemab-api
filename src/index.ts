import process from 'process';
import Hapi from '@hapi/hapi';
import routes from './routes';

const HOST: string = process.env.HTTP_HOST || '0.0.0.0';
const PORT: string = process.env.HTTP_PORT || '3010';

const init = async () => {
  const server: Hapi.Server<Hapi.ServerApplicationState> = Hapi.server({
    host: HOST,
    port: PORT,
    routes: {
      cors: true
    }
  });

  // Mendaftarkan seluruh rute pada API
  server.route(routes);

  await server.start();

  console.log('Server started!');
}

process.addListener('unhandledRejection', (error) => {
  console.log(error);
});

init();