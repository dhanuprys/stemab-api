import process from 'process';
import mariadb from 'mariadb';

class Database {
  private pool;
  private connection: any;

  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.DB_HOST || 'localhost', 
      user: process.env.DB_USER || 'root', 
      password: process.env.DB_PASSWORD,
      // @ts-ignore
      port: process.env.DB_PORT || 3306,
    });
    
    console.log('Database initialized');

    // this.connection = this.pool.getConnection();
    this.connection = null;
  }

  public async getConnection() {
    return await this.connection;
  }

  /**
   * Membuat koneksi baru ke database
   * @returns 
   */
  public async createNewConnection() {
    let connection;

    console.log('Creating new connection');

    try {
      connection = await this.pool.getConnection();
      console.log('Created');
    } catch (error) {
      console.log('Database error: parent');
    }

    return connection;
  }

  public async close() {
    await this.pool.end();
  }
}

export default Database;