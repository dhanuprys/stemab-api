import moment from 'moment-timezone';
import chalk from 'chalk';

export type LoginCredential = {
  username: string,
  password: string
}

export enum LogStatus {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error'
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
    + String(date.getDay()*date.getMonth())
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
  // const date = new Date();
  const [ username, password ] = Buffer.from(payload, 'base64')
                                    .toString('utf-8')
                                    .split(`|0x0|`);
                                    // .split(`|${date.getUTCHours()+(date.getDay()-1)}|`);
  // console.log(date.getUTCHours()+(date.getDay()-1), payload);
  // console.log(username, password);
  if (
    typeof username === undefined 
    || typeof password === undefined
  ) {
    return null;
  }

  return {
    username,
    password
  };
}

export function printLog(status: LogStatus, ...text: string[]) {
  let outputStatus = 'info';
  switch (status) {
    case LogStatus.info:
      outputStatus = chalk.blue('info');
    break;
    case LogStatus.success:
      outputStatus = chalk.green('success');
    break;
    case LogStatus.warning:
      outputStatus = chalk.yellow('warning');
    break;
    case LogStatus.error:
      outputStatus = chalk.red('error');
    break;
  }

  console.log(chalk.bold(`[${getCurrentDate()}][${outputStatus}]>`), ...text);
}

/**
 * Membuat catatan waktu
 * 
 * @returns {string}
 */
export function getCurrentDate(): string {
  return moment().tz('Asia/Makassar').format('D-MM-YYYY, HH:mm:ss');
}