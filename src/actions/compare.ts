import { Project, ProjectService } from "../services/project";
import { BranchService } from "../services/branch";
import {
  PipelineService,
  PIPELINE_ORDER,
  PIPELINE_STATUS,
} from "../services/pipeline";
import { log, warn, success } from "../logger";
import { warnWrongInput } from "../utils";
import { DevelopmentService } from "../services/development";

const KNOWN_REPOS = {
  "go1-player": 1760,
  learn: 2212,
};

export async function compare(...args: any[]): Promise<void> {
  const [projectName, from, environment] = args;

  // search in the predefined list first
  let project: Project | undefined;

  const projectID = KNOWN_REPOS[projectName];
  const projectService = new ProjectService();

  if (!projectID) {
    const projects = await projectService.searchProject({
      page: 1,
      per_page: 20,
      search: projectName,
    });

    if (warnWrongInput(projectName, projects, "name")) {
      return;
    }
    project = projects.shift();
  } else {
    log("fetching project: %s...", projectID);
    project = await projectService.getProject(projectID);
  }

  const branchService = new BranchService(project.id);

  log("scanning branch: %s...", from);
  const branches = await branchService.search({
    search: `${from}`,
  });

  if (warnWrongInput(from, branches, "name")) {
    return;
  }

  success("Found branch: %s", from);
  const branch = branches.find((item) => item.name === from);

  const pipelineService = new PipelineService();
  log("scanning pipeline of the branch...");
  let pipelines = await pipelineService.searchPipeline({
    id: project.id,
    ref: branch.name,
    sort: "desc",
    order_by: PIPELINE_ORDER.updated_at,
    page: 1,
    per_page: 20,
    // status: [PIPELINE_STATUS.success],
  });

  // if (!pipelines.some((item) => item.status === "success")) {
  //   warn("No passed pipeline found. Please check again");
  //   return;
  // }
  // const pipeline = pipelines.find((item) => item.status === "success");

  if (pipelines?.length < 1) {
    warn("No passed pipeline found. Please check again");
    return;
  }
  const pipeline = pipelines[0];
  success("Found pipeline: %s", pipeline.id);

  log("scanning tag: %s...", pipeline.id);
  pipelines = await pipelineService.searchPipeline({
    id: project.id,
    ref: pipeline.id.toString(), // cause we're setting up "PIPELINE_ID => TAG_NAME"
  });

  if (pipelines.length < 1) {
    warn("No TAG created so far");
    return;
  }

  const tagPipeline = pipelines.shift();

  const developmentService = new DevelopmentService(project.id);

  log("scanning env: %s", environment);
  const deps = await developmentService.searchDevelopment({
    projectId: project.id,
    environment,
    status: "success",
    sort: "desc",
  });

  if (deps.length < 1) {
    warn("No development found");
    return;
  }

  const development = deps.shift();

  success(
    `${project.web_url}/-/compare/${development.ref}...${tagPipeline.ref}`
  );
}
