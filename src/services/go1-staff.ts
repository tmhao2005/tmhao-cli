import { HttpInstance, createHttp } from "./http";

interface Staff {
  uuid: string;
  jwt: string;
}

export class GO1StaffService {
  private _http: HttpInstance;

  constructor() {
    this._http = createHttp(process.env.GO1_API);
  }

  async getStaffByUUID(uuid: string) {
    const { data } = await this._http.get<Staff>(
      `/user/account/current/${uuid}`
    );

    return data;
  }
}
