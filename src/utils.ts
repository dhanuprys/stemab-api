import moment from 'moment-timezone';

export type LoginCredential = {
  nisn: string,
  nis: string
}

/**
 * Daylock digunakan untuk menyinkronkan kunci akses antara client dengan
 * server sehingga alamat akses akan bersifat dinamis
 * 
 * @param {string} encryptedTime 
 * @param {boolean} bypass
 * @returns {boolean}
 */
export function checkDaylock(
  encryptedTime: string, 
  bypass: boolean = false
): boolean {
  if (bypass) return true;

  const date: Date = new Date();
  const currentFormat: string = Buffer.from(
    String(date.getDate())
    + String(date.getFullYear()/date.getDate())
    + String(date.getDay())
  ).toString('base64');

  return currentFormat === encryptedTime;
}

/**
 * Mengubah data NISN yang di-enskripsi menjadi string NISN yang 
 * dapat dibaca
 * 
 * NISN|JAM+(HARI-1)|NIS
 * 
 * @param {string} payload Data NISN yang terinskripsi
 * @returns {string | null}
 */
export function parseNISNLogin(payload: string): any {
  const date = new Date();
  const [ nisn, nis ] = Buffer.from(payload, 'base64')
                                    .toString('utf-8')
                                    .split(`|0x0|`);
                                    // .split(`|${date.getUTCHours()+(date.getDay()-1)}|`);
  // console.log(date.getUTCHours()+(date.getDay()-1), payload);
  console.log(nisn, nis);
  if (
    typeof nisn === undefined 
    || typeof nis === undefined
  ) {
    return null;
  }

  return {
    nisn,
    nis
  };
}

/**
 * Membuat catatan waktu
 * 
 * @returns {string}
 */
export function getCurrentDate(): string {
  return moment().tz('Asia/Makassar').format('D-MM-YY, HH:mm:ss');
}