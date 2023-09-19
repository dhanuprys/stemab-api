import process from 'process';
import Hapi from '@hapi/hapi';
import Database from './database';
import getRouteList from './routes';
import path from 'path';

const HOST: string = process.env.HTTP_HOST || '0.0.0.0';
const PORT: string = process.env.HTTP_PORT || '3010';

const init = async () => {
  const server: Hapi.Server<Hapi.ServerApplicationState> = Hapi.server({
    host: HOST,
    port: PORT,
    routes: {
      cors: true,
    }
  });
  const db = new Database();
  const connection = await db.getConnection();

  await server.register(require('@hapi/inert'));

  // Mendaftarkan seluruh rute pada API
  server.route(getRouteList(connection));

  await server.start();

  console.log('Server started!');
}

process.addListener('unhandledRejection', (error) => {
  console.log(error);
  process.exit(1);
});

init();