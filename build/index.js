#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { resolve } = require('path');
const dotenv_1 = require("dotenv");
const program = require("commander");
const hotfix_1 = require("./actions/hotfix");
const playJob_1 = require("./actions/playJob");
const parsed = dotenv_1.config({
    path: resolve(__dirname, '..', '.env'),
});
if (parsed.error) {
    throw 'You missed to create the required `.env` file';
}
program
    .version('1.0.0')
    .command('hotfix <projectName> <branchName>')
    .description('create a hotfix for specific app')
    .action(hotfix_1.hotfix);
program
    .command('playJob <projectName> <branchName> <jobName> [checkOnly]')
    .description('will play specific job on the latest pipeline')
    .action(playJob_1.playJob);
program.parse(process.argv);
