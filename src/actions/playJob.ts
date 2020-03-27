import { searchProject } from "../services/project";
import { BranchService } from "../services/branch";
import { PipelineService } from "../services/pipeline";
import { JobService } from "../services/job";
import { warn, info } from "../utils";

export async function playJob() {
  const [projectName, branchName, jobName, checkOnly] = arguments;

  const projects = await searchProject({
    search: projectName,
  });

  // Need a common validator
  if (!projects.some((item) => item.name === projectName)) {
    warn("More than one projects found. Check below projects found:");
    projects.length && warn(projects.map((item) => item.name).join(","));
    return;
  }

  const project = projects.shift();
  const branchService = new BranchService(project.id);

  const branches = await branchService.search({
    search: `${branchName}`,
  });

  if (!branches.some((item) => item.name === branchName)) {
    warn(`more than one branches or not found. Check below branches found:`);
    branches.length && warn(branches.map((item) => item.name).join(","));
    return;
  }

  const branch = branches.find((item) => item.name === branchName);
  const pipelineService = new PipelineService();

  // latest pipeline of input branch
  // 2x
  let pipelines = await pipelineService.searchPipeline({
    id: project.id,
    ref: branch.name,
  });

  if (pipelines.length < 1) {
    warn("No pipeline created so far");
    return;
  }

  // Make sure this pipeline has passed
  if (!pipelines.some((item) => item.status === "success")) {
    warn("No passed pipeline found. Please check again");
    return;
  }

  let pipeline = pipelines.find((item) => item.status === "success");
  pipelines = await pipelineService.searchPipeline({
    id: project.id,
    ref: pipeline.id.toString(), // cause we're setting up "PIPELINE_ID => TAG_NAME"
  });

  if (pipelines.length < 1) {
    warn("No TAG created so far");
    return;
  }

  // Make sure this is manual pipeline
  // if (!pipelines.some(item => item.status === 'manual')) {
  //   warn('No manual TAG created');
  //   return;
  // }

  // pipeline = pipelines.find(item => item.status === 'manual');
  pipeline = pipelines.shift();

  const jobService = new JobService(project.id);

  const jobs = await jobService.getPipelineJobs({
    pipelineId: pipeline.id,
  });

  if (!jobs.some((item) => item.name === jobName)) {
    warn("Your job name is wrong. Here is what we found:");
    warn(jobs.map((item) => item.name).join(", "));
    return;
  }

  const job = jobs.find((item) => item.name === jobName);

  if (job.status === "running") {
    warn("This job has been running already. Watch here:");
    warn(job.web_url);
    return;
  }

  if (checkOnly) {
    info("Here is the latest job:");
    info(job.web_url);
    return;
  }

  const result = await jobService.playJob(job.id);

  info(`Congrats! You triggered successfully. Here is the job URL:`);
  info(result.web_url);
}
