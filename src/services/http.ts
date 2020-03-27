import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export type HttpInstance = AxiosInstance;

export function createHttp(opts: AxiosRequestConfig = {}): HttpInstance {
  const http = axios.create({
    baseURL: `${process.env.GITLAB_API}/api/v4`,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
    },
    ...opts,
  }) as HttpInstance;

  return http;
}
