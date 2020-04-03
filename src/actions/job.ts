import { ProjectService } from "../services/project";
import { BranchService } from "../services/branch";
import { PipelineService } from "../services/pipeline";
import { JobService } from "../services/job";
import { log, warn, success } from "../logger";
import { warnWrongInput } from "../utils";

export async function playJob() {
  const [projectName, branchName, jobName, cmd] = arguments;
  const play = cmd.play;

  const projectService = new ProjectService();
  const projects = await projectService.searchProject({
    search: projectName,
  });

  if (warnWrongInput(projectName, projects, "name")) {
    return;
  }

  const project = projects.shift();
  const branchService = new BranchService(project.id);

  log("scanning input branch: %s...", branchName);
  const branches = await branchService.search({
    search: `${branchName}`,
  });

  if (warnWrongInput(branchName, branches, "name")) {
    return;
  }

  success("Found branch: %s", branchName);
  const branch = branches.find((item) => item.name === branchName);
  const pipelineService = new PipelineService();

  log("scanning pipeline of the branch...");
  let pipelines = await pipelineService.searchPipeline({
    id: project.id,
    ref: branch.name,
  });

  // Make sure this pipeline has passed
  if (!pipelines.some((item) => item.status === "success")) {
    warn("No passed pipeline found. Please check again");
    return;
  }

  let pipeline = pipelines.find((item) => item.status === "success");

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

  pipeline = pipelines.shift();
  success("Found pipeline: %s", pipeline.id);
  const jobService = new JobService(project.id);

  log("scanning job name: %s...", jobName);
  const jobs = await jobService.getPipelineJobs({
    pipelineId: pipeline.id,
  });

  if (warnWrongInput(jobName, jobs, "name")) {
    return;
  }

  const job = jobs.find((item) => item.name === jobName);

  if (job.status === "running") {
    warn(
      "This job has been running already. Here is the link: %s",
      job.web_url
    );
    return;
  }

  if (!play) {
    success(
      "Latest job link: %s [%s]. If you wish to trigger, Run with option:  `-p`",
      job.web_url,
      job.status
    );
    return;
  }

  // Hack deploy production
  if (/deploy:production/.test(job.name)) {
    const k8sJobName = "deploy:qa:k8s";

    log("Scanning job: %s", k8sJobName);
    if (warnWrongInput("deploy:qa:k8s", jobs, "name")) {
      return;
    }

    log("Deploying job: %s", k8sJobName);
    const k8sJob = jobs.find((item) => item.name === "deploy:qa:k8s");
    await jobService.playJob(k8sJob.id);
    success("Deployed successfully %s job", k8sJobName);

    log("Canceling job: %s", job.id);
    await jobService.cancelJob(job.id);
    success("Cancel successfully job %s", job.name);
  }

  const result = await jobService.playJob(job.id);

  success(
    `You triggered the job "${jobName}" in pipeline "${pipeline.id}". Here is the job URL: ${result.web_url}`
  );
}
