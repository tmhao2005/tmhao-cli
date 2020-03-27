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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const qs = require("query-string");
const http_1 = require("./http");
const project_1 = require("./project");
const searchDevelopment = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { projectId } = _a, query = __rest(_a, ["projectId"]);
    const http = http_1.createHttp();
    const { data } = yield http.get(`/projects/${projectId}/deployments?${qs.stringify(query)}`);
    return data;
});
const createBranch = (projectId, branchName, ref) => __awaiter(void 0, void 0, void 0, function* () {
    const http = http_1.createHttp();
    const { data } = yield http.post(`/projects/${projectId}/repository/branches`, {
        id: projectId,
        branch: branchName,
        ref,
    });
    return data;
});
exports.deleteBranch = (projectId, branchName) => __awaiter(void 0, void 0, void 0, function* () {
    const http = http_1.createHttp();
    const { data } = yield http.delete(`/projects/${projectId}/repository/branches/${branchName}`);
    return data;
});
const makeHotfixNameRight = (name) => {
    const re = /^hotfix-(.+)$/;
    if (!re.test(name)) {
        return `hotfix-${name}`;
    }
    return name;
};
exports.createHotfix = ({ projectName, branchName }) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_1.searchProject({
        search: projectName,
    });
    // If more than 2 projects, we might have to warn user
    if (projects.length < 1 || projects.length > 1) {
        console.warn(chalk.yellow(`Your project name "${projectName}" seems to return wrong result ${projects.length}. Please check again`));
        return null;
    }
    const project = projects.pop();
    const deps = yield searchDevelopment({
        projectId: project.id,
        environment: 'production',
        status: 'success'
    });
    if (deps.length < 1) {
        console.warn(chalk.yellow(`We found no development for this project. Please check again`));
        return null;
    }
    const dep = deps.shift();
    const branch = yield createBranch(project.id, makeHotfixNameRight(branchName), dep.ref);
    return {
        project,
        dep,
        branch,
    };
});
