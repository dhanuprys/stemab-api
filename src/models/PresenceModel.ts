import process from 'process';
import { PoolConnection } from 'mariadb';
import { getCurrentDate } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  daylock: string,
  username: string,
  timestamp: string
};


class PresenceModel {
  constructor(private connection: PoolConnection) {
    
  }

  async close() {
    await this.connection.end();
  }

  async isLogin(daylock: string, username: string): Promise<DatabaseBlueprint | null> {
    let result: DatabaseBlueprint[] = [];
    try {
      result = await this.connection.query(
        `SELECT * FROM stemsi.presence WHERE username = ? AND daylock = ?`,
        [ username, daylock ]
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

  async login(daylock: string, username: string): Promise<DatabaseBlueprint | null> {
    let result;
    const currentDate = getCurrentDate();
    
    try {
      result = await this.connection.query(
        `
          INSERT INTO stemsi.presence (daylock,username,timestamp) 
          VALUES (?, ?, ?)
        `,
        [ daylock, username, currentDate ]
      )
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
    
    if (result && result.affectedRows === 1) {
      return {
        id: -1,
        daylock,
        username,
        timestamp: currentDate
      }
    }

    return null;
  }
}

export default PresenceModel;