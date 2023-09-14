/**
 * Model response API paling dasar yang digunakan pada  aplikasi
 */
export type RawRESTResponse<T> = {
  status: boolean,
  message: string,
  data?: T
};