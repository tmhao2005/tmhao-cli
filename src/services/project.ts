import * as qs from "query-string";
import { BaseService } from "./base";

interface SearchProjectInput {
  search: string;
}

interface Project {
  id: number;
  name: string;
  web_url: string;
}

export class ProjectService extends BaseService {
  constructor() {
    super();
  }

  searchProject = async (query: SearchProjectInput): Promise<Project[]> => {
    const { data } = await this._http.get(`/projects?${qs.stringify(query)}`);

    return data;
  };
}
