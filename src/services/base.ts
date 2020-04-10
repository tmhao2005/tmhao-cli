import { AxiosInstance } from "axios";
import { createHttp } from "./http";

export class BaseService {
  protected _http: AxiosInstance;

  constructor() {
    this._http = createHttp(`${process.env.GITLAB_API}/api/v4`, {
      "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
    });
  }
}
