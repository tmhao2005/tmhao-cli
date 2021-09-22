import * as qs from "query-string";
import { BaseService } from "./base";

interface SearchProjectInput {
  search: string;
  page?: number
  per_page?: number
}

export interface Project {
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

  getProject = async (id: number): Promise<Project> => {
    const { data } = await this._http.get(`/projects/${id}`);

    return data;
  };
}
