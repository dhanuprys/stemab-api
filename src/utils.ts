/**
 * 
 * @param encryptedTime string
 * @param bypass boolean
 * @returns boolean
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

export function parseNISN(payload: string): string | null {
  const date = new Date();
  const realNISN: string = Buffer.from(payload, 'base64')
                                    .toString('utf-8')
                                    .split(`|${date.getUTCHours()}|`)[0];

  if (!realNISN.match(/^[\d]{10}$/)) {
    return null;
  }

  return payload;
}

export function getCurrentDate() {
  const date = new Date();

  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
}