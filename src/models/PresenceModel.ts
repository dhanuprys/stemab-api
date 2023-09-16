import Database from '../database';
import { getCurrentDate } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  daylock: string,
  nisn: string,
  timestamp: string
};


class PresenceModel {
  protected connection: any;

  constructor(private database: Database) {
    
  }

  async setup() {
    this.connection = await this.database.createNewConnection();
  }

  async isLogin(daylock: string, nisn: string): Promise<DatabaseBlueprint | null> {
    let result: string[] = [];
    try {
      result = await this.connection.query(
        `SELECT * FROM presence WHERE nisn = ? AND nis = ?`,
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

export default PresenceModel;