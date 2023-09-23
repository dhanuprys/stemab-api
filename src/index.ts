import process from 'process';
import Hapi from '@hapi/hapi';
import Database from './database';
import getRouteList from './routes';
import { LogStatus, printLog } from './utils';

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
  const db = new Database();
  const connection = await db.getConnection();

  await server.register(require('@hapi/inert'));

  // Mendaftarkan seluruh rute pada API
  server.route(getRouteList(connection));

  await server.start();

  printLog(LogStatus.info, 'Server started.', `PORT:${PORT}`);

  // Menjaga koneksi database
  setInterval(async () => {
    try {
      await connection.query('SHOW DATABASES');
    } catch (error) {
      printLog(LogStatus.error, 'KEEPALIVE FAILED. NEED TO RESTART THE SERVICE');
      process.exit(1);
    }
  }, 3500);
}

process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit(1);
});

init();