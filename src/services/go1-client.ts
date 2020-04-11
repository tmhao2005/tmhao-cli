import { HttpInstance, createHttp } from "./http";

interface Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface AppInfo {
  client_id: string;
  client_secret: string;
  client_name: string;
  redirect_uri: string;
}

interface BotAppPayload {
  name: string;
  baseUri: string;
}

export class GO1ClientService {
  private _http: HttpInstance;

  constructor() {
    this._http = createHttp(process.env.GO1_APP_ENDPOINT);
  }

  async getToken() {
    const { data } = await this._http.post<Token>("/oauth/token", {
      client_id: process.env.GO1_CLIENT_ID,
      username: process.env.GO1_ACC,
      password: process.env.GO1_PW,
      grant_type: "password",
      scope: "app.read app.write",
    });

    return data;
  }

  async grantAccessProxyApi(staffToken: string, info: AppInfo) {
    this._http.setJWT(staffToken);

    const { data } = await this._http.put(`/staff/client/${info.client_id}`, {
      client_name: info.client_name,
      redirect_uri: info.redirect_uri,
      proxy_api: true,
    });

    return data;
  }

  async createBotApp(payload: BotAppPayload) {
    const token = await this.getToken();
    this._http.setJWT(token.access_token);

    const { data } = await this._http.post<AppInfo>("/client", {
      client_name: payload.name,
      redirect_uri: `${payload.baseUri}/edu/access/callback`,
    });

    return data;
  }
}
