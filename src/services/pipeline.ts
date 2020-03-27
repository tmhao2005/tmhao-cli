import * as qs from "query-string";
import { BaseService } from "./base";

interface SearchPipelineInput {
  id: number;
  ref?: string;
}

interface Pipeline {
  id: number;
  status: string;
  ref: string;
}

export class PipelineService extends BaseService {
  constructor() {
    super();
  }

  searchPipeline = async ({
    id,
    ...query
  }: SearchPipelineInput): Promise<Pipeline[]> => {
    const { data } = await this._http.get(
      `/projects/${id}/pipelines?${qs.stringify(query)}`
    );

    return data;
  };
}
