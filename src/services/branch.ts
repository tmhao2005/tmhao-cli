import * as qs from "query-string";
import { BaseService } from "./base";

interface Branch {
  id: number;
  name: string;
}

interface SearchBranchInput {
  search?: string;
}

export class BranchService extends BaseService {
  constructor(private id: number) {
    super();
  }

  async search(query: SearchBranchInput): Promise<Branch[]> {
    const { data } = await this._http.get(
      `/projects/${this.id}/repository/branches?${qs.stringify(query)}`
    );

    return data;
  }

  createBranch = async (branchName: string, ref: string): Promise<Branch> => {
    const { data } = await this._http.post(
      `/projects/${this.id}/repository/branches`,
      {
        id: this.id,
        branch: branchName,
        ref,
      }
    );

    return data;
  };

  deleteBranch = async (branchName: string) => {
    const { data } = await this._http.delete(
      `/projects/${this.id}/repository/branches/${branchName}`
    );

    return data;
  };
}
