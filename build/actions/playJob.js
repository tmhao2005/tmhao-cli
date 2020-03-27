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
const project_1 = require("../services/project");
const branch_1 = require("../services/branch");
const pipeline_1 = require("../services/pipeline");
const job_1 = require("../services/job");
const utils_1 = require("../utils");
function playJob() {
    return __awaiter(this, arguments, void 0, function* () {
        const [projectName, branchName, jobName, checkOnly] = arguments;
        const projects = yield project_1.searchProject({
            search: projectName,
        });
        // Need a common validator
        if (!projects.some(item => item.name === projectName)) {
            utils_1.warn('More than one projects found. Check below projects found:');
            projects.length && utils_1.warn(projects.map(item => item.name).join(','));
            return;
        }
        const project = projects.shift();
        const branchService = new branch_1.BranchService(project.id);
        const branches = yield branchService.search({
            search: `${branchName}`,
        });
        if (!branches.some(item => item.name === branchName)) {
            utils_1.warn(`more than one branches or not found. Check below branches found:`);
            branches.length && utils_1.warn(branches.map(item => item.name).join(','));
            return;
        }
        const branch = branches.find(item => item.name === branchName);
        const pipelineService = new pipeline_1.PipelineService();
        // latest pipeline of input branch
        // 2x
        let pipelines = yield pipelineService.searchPipeline({
            id: project.id,
            ref: branch.name,
        });
        if (pipelines.length < 1) {
            utils_1.warn('No pipeline created so far');
            return;
        }
        // Make sure this pipeline has passed
        if (!pipelines.some(item => item.status === 'success')) {
            utils_1.warn('No passed pipeline found. Please check again');
            return;
        }
        let pipeline = pipelines.find(item => item.status === 'success');
        pipelines = yield pipelineService.searchPipeline({
            id: project.id,
            ref: pipeline.id.toString(),
        });
        if (pipelines.length < 1) {
            utils_1.warn('No TAG created so far');
            return;
        }
        // Make sure this is manual pipeline
        // if (!pipelines.some(item => item.status === 'manual')) {
        //   warn('No manual TAG created');
        //   return;
        // }
        // pipeline = pipelines.find(item => item.status === 'manual');
        pipeline = pipelines.shift();
        const jobService = new job_1.JobService(project.id);
        const jobs = yield jobService.getPipelineJobs({
            pipelineId: pipeline.id,
        });
        if (!jobs.some(item => item.name === jobName)) {
            utils_1.warn('Your job name is wrong. Here is what we found:');
            utils_1.warn(jobs.map(item => item.name).join(', '));
            return;
        }
        const job = jobs.find(item => item.name === jobName);
        if (job.status === 'running') {
            utils_1.warn('This job has been running already. Watch here:');
            utils_1.warn(job.web_url);
            return;
        }
        if (checkOnly) {
            utils_1.info('Here is the latest job:');
            utils_1.info(job.web_url);
            return;
        }
        const result = yield jobService.playJob(job.id);
        utils_1.info(`Congrats! You triggered successfully. Here is the job URL:`);
        utils_1.info(result.web_url);
    });
}
exports.playJob = playJob;
