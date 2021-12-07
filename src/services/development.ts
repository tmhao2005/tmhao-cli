import qs from "query-string";
import { BaseService } from "./base";

type Env = "production";
type Status = "success";

interface Development {
  id: number;
  ref: string;
}

interface SearchDevelopmentInput {
  projectId: number;
  environment?: Env;
  status?: Status;
  sort?: "desc" | "asc";
}

export class DevelopmentService extends BaseService {
  constructor(private id: number) {
    super();
  }

  searchDevelopment = async ({
    projectId,
    ...query
  }: SearchDevelopmentInput): Promise<Development[]> => {
    const { data } = await this._http.get(
      `/projects/${this.id}/deployments?${qs.stringify(query)}`
    );

    return data;
  };
}
