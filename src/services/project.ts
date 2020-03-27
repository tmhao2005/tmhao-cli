import * as qs from "query-string";
import { createHttp } from "./http";

interface SearchProjectInput {
  search: string;
}

interface Project {
  id: number;
  name: string;
}

export const searchProject = async (
  query: SearchProjectInput
): Promise<Project[]> => {
  const http = createHttp();
  const { data } = await http.get(`/projects?${qs.stringify(query)}`);

  console.log(`/projects?search=${qs.stringify(query)}`);

  return data;
};
