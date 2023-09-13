import Database from '../database';

class UserModel {
  protected connection: any;

  constructor(private database: Database) {
    
  }

  async setup() {
    this.connection = await this.database.createConnection();
  }

  async isLogin(daylock: string, nisn: string): Promise<boolean> {
    let result: [] = [];
    try {
      result = await this.connection.query(
        `
          SELECT (id) 
          FROM absensi 
          WHERE \`nisn\` = ?
          AND \`daylock\` = ?
        `,
        [ nisn, daylock ]
      );
    } catch (error) {

    }
    
    return result.length > 0;
  }

  async login(daylock: string, nisn: string): Promise<boolean> {
    let result = false;
    
    try {
      result = await this.connection.query(
        `
          INSERT INTO stemsi.absensi (daylock,nisn,timestamp) 
          VALUES (?, ?, curdate())
        `,
        [ daylock, nisn ]
      )
    } catch (error) {

    }
    
    return result;
  }
}

export default UserModel;