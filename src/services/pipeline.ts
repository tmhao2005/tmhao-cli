import qs from "query-string";
import { BaseService } from "./base";

export enum PIPELINE_STATUS {
  created = "created",
  success = "success",
  running = "running",
  failed = "failed",
  // waiting_for_resource,
  // preparing,
  // pending,
  // running,
  // success,
  // failed,
  // canceled,
  // skipped,
  // manual,
  // scheduled
}

export enum PIPELINE_ORDER {
  status = "status",
  ref = "ref",
  updated_at = "updated_at",
  created_at = "created_at",
}
interface SearchPipelineInput {
  id: number;
  ref?: string;
  status?: PIPELINE_STATUS | PIPELINE_STATUS[];
  order_by?: PIPELINE_ORDER;
  sort?: string;
  per_page?: number;
  page?: number;
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
