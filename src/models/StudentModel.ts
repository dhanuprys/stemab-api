import Database from '../database';
import { LoginCredential } from '../utils';

export type DatabaseBlueprint = {
  id: number,
  nisn: string,
  nis: string
};

/**
 * Menyimpan NISN dan NIS setiap siswa.
 * Digunakan dalam melakukan proses login ke database
 */
class StudentModel {
  protected connection: any;

  constructor(private database: Database) {
    
  }

  async setup() {
    this.connection = await this.database.getConnection();
  }

  /**
   * Mengecek apakah nisn yang dimasukkan siswa pada form login
   * sudah benar atau tidak
   */
  async isValid(login: LoginCredential): Promise<boolean> {
    let result: string[] = [];
    try {
      result = await this.connection.query(
        `SELECT * FROM siswa WHERE nisn = ? AND nis = ?`,
        [ login.nisn, login.nis ]
      );
    } catch (error) {
      console.log(error);
    }

    
    if (result.length === 0) {
      return false;
    }

    return true;
  }
}

export default StudentModel;