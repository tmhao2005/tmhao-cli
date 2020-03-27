import * as qs from "query-string";
import { createHttp } from "./http";

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

export const searchDevelopment = async ({
  projectId,
  ...query
}: SearchDevelopmentInput): Promise<Development[]> => {
  const http = createHttp();
  const { data } = await http.get(
    `/projects/${projectId}/deployments?${qs.stringify(query)}`
  );

  return data;
};
