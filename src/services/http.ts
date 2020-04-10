import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { log, red } from "../logger";

export type HttpInstance = AxiosInstance & Extras;

interface Extras {
  setJWT(jwt: string): void;
}

export function createHttp(
  baseURL: string,
  headers: Record<string, string> = {},
  opts: AxiosRequestConfig = {}
): HttpInstance {
  const http = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      ...headers,
    },
    ...opts,
  }) as HttpInstance;

  http.interceptors.request.use((reqConfig: AxiosRequestConfig) => {
    log(
      `${reqConfig.method && reqConfig.method.toUpperCase()} ${reqConfig.url}`,
      reqConfig.params,
      reqConfig.data
    );
    return reqConfig;
  });

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      red("[LOG]: %s", error);
      throw error;
    }
  );

  http.setJWT = (jwt: string) => {
    http.defaults.headers.Authorization = `Bearer ${jwt}`;
  };

  return http;
}
