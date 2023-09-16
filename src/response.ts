/**
 * Model response API paling dasar yang digunakan pada  aplikasi
 */
export type RawRESTResponse<T> = {
  status: boolean,
  message: string,
  data?: T
};

export function createRESTResponse<T>(status: boolean, message: string, data: T): RawRESTResponse<T> {
  return {
    status,
    message,
    data
  }
}