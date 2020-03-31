import { ProjectService } from "../services/project";
import { searchDevelopment } from "../services/development";
import { BranchService } from "../services/branch";
import { warnWrongInput } from "../utils";
import { log, success, warn } from "../logger";

export async function hotfix() {
  const [projectName, branchName, cmd] = arguments;
  const { branchCreation } = cmd;

  log("scanning input project...");
  const projectService = new ProjectService();
  const projects = await projectService.searchProject({
    search: projectName,
  });

  if (warnWrongInput(projectName, projects, "name")) {
    return;
  }

  success("Found the project");
  const project = projects.pop();
  const branchService = new BranchService(project.id);

  log("scanning production env...");
  const deps = await searchDevelopment({
    projectId: project.id,
    environment: "production",
    status: "success",
    sort: "desc",
  });

  if (deps.length < 1) {
    warn("We found no development for this project. Please check again");
    return null;
  }

  const dep = deps.shift();
  success("Found ref: %s", dep.ref);

  if (!branchCreation) {
    success(
      `Run this to create your hotfix: "git fetch origin ${
        dep.ref
      } && git checkout -b ${makeHotfixNameRight(branchName)} origin/${
        dep.ref
      }"`
    );
    return;
  }

  const branch = await branchService.createBranch(
    makeHotfixNameRight(branchName),
    dep.ref
  );

  if (branch) {
    success(
      `Pull your hotfix branch by: "git fetch origin ${branch.name} && git checkout -b ${branch.name} origin/${branch.name}"`
    );
  }
}

const makeHotfixNameRight = (name: string): string => {
  const re = /^hotfix-(.+)$/;

  if (!re.test(name)) {
    return `hotfix-${name}`;
  }
  return name;
};
