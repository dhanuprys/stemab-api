import process from 'process';
import mariadb from 'mariadb';

class Database {
  private database;
  private connection;

  constructor() {
    this.database = mariadb.createPool({
      host: process.env.DB_HOST || 'localhost', 
      user: process.env.DB_USER || 'root', 
      password: process.env.DB_PASSWORD,
      // @ts-ignore
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'stemsi'
    });

    try {
      this.connection = this.database.getConnection();
    } catch (error) {
      console.log('Database error');
    }
  }

  public async getConnection() {
    return this.connection;
  }

  /**
   * Membuat koneksi baru ke database
   * @returns 
   */
  public async createNewConnection() {
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