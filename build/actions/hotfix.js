"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const project_1 = require("../services/project");
const development_1 = require("../services/development");
const branch_1 = require("../services/branch");
function hotfix() {
    return __awaiter(this, arguments, void 0, function* () {
        const [projectName, branchName] = arguments;
        const projects = yield project_1.searchProject({
            search: projectName,
        });
        // If more than 2 projects, we might have to warn user
        if (projects.length < 1 || projects.length > 1) {
            console.warn(chalk.yellow(`Your project name "${projectName}" seems to return wrong result ${projects.length}. Please check again`));
            return null;
        }
        const project = projects.pop();
        const branchService = new branch_1.BranchService(project.id);
        const deps = yield development_1.searchDevelopment({
            projectId: project.id,
            environment: 'production',
            status: 'success'
        });
        if (deps.length < 1) {
            console.warn(chalk.yellow(`We found no development for this project. Please check again`));
            return null;
        }
        const dep = deps.shift();
        const branch = yield branchService.createBranch(makeHotfixNameRight(branchName), dep.ref);
        if (branch) {
            console.log(chalk.green(`A branch ${branch.name} has been created from latest production tag ${dep.ref}. Pull your hotfix branch by:`));
            console.log(chalk.yellow(`git fetch origin ${branch.name} && git checkout -b ${branch.name} origin/${branch.name}`));
        }
    });
}
exports.hotfix = hotfix;
const makeHotfixNameRight = (name) => {
    const re = /^hotfix-(.+)$/;
    if (!re.test(name)) {
        return `hotfix-${name}`;
    }
    return name;
};
