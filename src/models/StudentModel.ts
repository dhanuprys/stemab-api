import { PoolConnection } from 'mariadb';
import { LoginCredential } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  name: string,
  nisn: string,
  nis: string
};

/**
 * Menyimpan NISN dan NIS setiap siswa.
 * Digunakan dalam melakukan proses login ke database
 */
class StudentModel {
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
        `SELECT * FROM stemsi.student WHERE nisn = ? AND nis = ?`,
        [ login.nisn, login.nis ]
      );
    } catch (error) {
      console.log(error);
    }
    
    if (result.length === 0) {
      return null;
    }

    return result[0];
  }
}

export default StudentModel;