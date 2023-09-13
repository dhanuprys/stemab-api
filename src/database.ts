import process from 'process';
import mariadb from 'mariadb';

class Database {
  private database;

  constructor() {
    this.database = mariadb.createPool({
      host: process.env.DB_HOST || 'localhost', 
      user: process.env.DB_USER || 'root', 
      password: process.env.DB_PASSWORD,
      // @ts-ignore
      port: process.env.DB_PORT || 3306,
      database: 'stemsi'
    });
  }

  public async createConnection() {
    let connection;

    try {
      connection = await this.database.getConnection();
    } catch (error) {
      console.log('Database error');
    }

    return connection;
  }
}

export default Database;