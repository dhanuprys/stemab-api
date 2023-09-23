import { PoolConnection } from 'mariadb';
import { LogStatus, LoginCredential, printLog } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  admin: number | null,
  name: string,
  username: string,
  password: string
};

/**
 * Menyimpan NISN dan NIS setiap siswa.
 * Digunakan dalam melakukan proses login ke database
 */
class UserModel {
  constructor(private connection: PoolConnection) {
    
  }

  async close() {
    await this.connection.end();
  }

  /**
   * Mengecek apakah nisn yang dimasukkan siswa pada form login
   * sudah benar atau tidak
   */
  async isAvailable(login: LoginCredential): Promise<DatabaseBlueprint | null> {
    let result: DatabaseBlueprint[] = [];
    try {
      result = await this.connection.query(
        `SELECT * FROM stemsi.users WHERE username = ? AND password = ?`,
        [ login.username, login.password ]
      );
    } catch (error) {
      printLog(LogStatus.error, error as unknown as string);
      // process.exit(1);
    }
    
    if (result.length === 0) {
      return null;
    }

    return result[0];
  }
}

export default UserModel;