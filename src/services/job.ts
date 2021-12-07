import qs from "query-string";
import { BaseService } from "./base";

interface Job {
  id: number;
  name: string;
  status: "running" | "started";
  web_url: string;
}

interface PipelineJobsInput {
  pipelineId: number;
  scope?: string;
}

export class JobService extends BaseService {
  constructor(private id: number) {
    super();
  }

  getPipelineJobs = async ({
    pipelineId,
    ...query
  }: PipelineJobsInput): Promise<Job[]> => {
    const { data } = await this._http.get(
      `/projects/${this.id}/pipelines/${pipelineId}/jobs?${qs.stringify(query)}`
    );

    return data;
  };

  async playJob(jobId: number): Promise<Job> {
    const { data } = await this._http.post(
      `/projects/${this.id}/jobs/${jobId}/play`
    );

    return data;
  }

  async cancelJob(jobId: number) {
    const { data } = await this._http.post(
      `/projects/${this.id}/jobs/${jobId}/cancel`
    );

    return data;
  }
}
