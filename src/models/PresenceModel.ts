import { PoolConnection } from 'mariadb';
import { getCurrentDate } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  daylock: string,
  nisn: string,
  timestamp: string
};


class PresenceModel {
  constructor(private connection: PoolConnection) {
    
  }

  async close() {
    await this.connection.end();
  }

  async isLogin(daylock: string, nisn: string): Promise<DatabaseBlueprint | null> {
    let result: DatabaseBlueprint[] = [];
    try {
      result = await this.connection.query(
        `SELECT * FROM stemsi.presence WHERE nisn = ? AND daylock = ?`,
        [ nisn, daylock ]
      );
    } catch (error) {
      console.log(error);
    }

    // console.log(daylock, nisn,result);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async login(daylock: string, nisn: string): Promise<DatabaseBlueprint | null> {
    let result;
    const currentDate = getCurrentDate();
    
    try {
      result = await this.connection.query(
        `
          INSERT INTO stemsi.presence (daylock,nisn,timestamp) 
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