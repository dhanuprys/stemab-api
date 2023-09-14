import { Console } from 'console';
import Database from '../database';
import { getCurrentDate } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  daylock: string,
  nisn: string,
  timestamp: string
};

class UserModel {
  protected connection: any;

  constructor(private database: Database) {
    
  }

  async setup() {
    this.connection = await this.database.createConnection();
  }

  async isLogin(daylock: string, nisn: string): Promise<DatabaseBlueprint | null> {
    let result: string[] = [];
    try {
      result = await this.connection.query(
        `SELECT * FROM absensi WHERE nisn = ? AND daylock = ?`,
        [ nisn, daylock ]
      );
    } catch (error) {
      console.log(error);
    }

    // console.log(daylock, nisn,result);

    if (result.length === 0) {
      return null;
    }

    return result[0] as unknown as DatabaseBlueprint;
  }

  async login(daylock: string, nisn: string): Promise<DatabaseBlueprint | null> {
    let result;
    const currentDate = getCurrentDate();
    
    try {
      result = await this.connection.query(
        `
          INSERT INTO stemsi.absensi (daylock,nisn,timestamp) 
          VALUES (?, ?, ?)
        `,
        [ daylock, nisn, currentDate ]
      )
    } catch (error) {
      console.log(error);
    }
    
    if (result && result.affectedRows === 1) {
      return {
        id: -1,
        daylock: daylock,
        nisn: nisn,
        timestamp: currentDate
      }
    }

    return null;
  }
}

export default UserModel;