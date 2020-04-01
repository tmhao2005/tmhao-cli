import { ProjectService } from "../services/project";
import { BranchService } from "../services/branch";
import { PipelineService } from "../services/pipeline";
import { log, warn, success } from "../logger";
import { warnWrongInput } from "../utils";
import { DevelopmentService } from "../services/development";

export async function compare() {
  const [projectName, from, environment] = arguments;

  const projectService = new ProjectService();
  const projects = await projectService.searchProject({
    search: projectName,
  });

  if (warnWrongInput(projectName, projects, "name")) {
    return;
  }

  const project = projects.shift();
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
  });

  if (!pipelines.some((item) => item.status === "success")) {
    warn("No passed pipeline found. Please check again");
    return;
  }

  const pipeline = pipelines.find((item) => item.status === "success");
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
