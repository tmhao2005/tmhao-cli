import * as chalk from "chalk";
import { ProjectService } from "../services/project";
import { searchDevelopment } from "../services/development";
import { BranchService } from "../services/branch";

export async function hotfix() {
  const [projectName, branchName] = arguments;

  const projectService = new ProjectService();
  const projects = await projectService.searchProject({
    search: projectName,
  });

  // If more than 2 projects, we might have to warn user
  if (projects.length < 1 || projects.length > 1) {
    console.warn(
      chalk.yellow(
        `Your project name "${projectName}" seems to return wrong result ${projects.length}. Please check again`
      )
    );
    return null;
  }

  const project = projects.pop();
  const branchService = new BranchService(project.id);

  const deps = await searchDevelopment({
    projectId: project.id,
    environment: "production",
    status: "success",
  });

  if (deps.length < 1) {
    console.warn(
      chalk.yellow(
        `We found no development for this project. Please check again`
      )
    );
    return null;
  }

  const dep = deps.shift();
  const branch = await branchService.createBranch(
    makeHotfixNameRight(branchName),
    dep.ref
  );

  if (branch) {
    console.log(
      chalk.green(
        `A branch ${branch.name} has been created from latest production tag ${dep.ref}. Pull your hotfix branch by:`
      )
    );
    console.log(
      chalk.yellow(
        `git fetch origin ${branch.name} && git checkout -b ${branch.name} origin/${branch.name}`
      )
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
