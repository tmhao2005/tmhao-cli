import { AxiosInstance } from "axios";
import { createHttp } from "./http";

export class BaseService {
  protected _http: AxiosInstance;

  constructor() {
    this._http = createHttp();
  }
}
