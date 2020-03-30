#!/usr/bin/env node

import { resolve } from "path";
import { config } from "dotenv";
import * as program from "commander";
import { hotfix } from "./actions/hotfix";
import { playJob } from "./actions/playJob";

const parsed = config({
  path: resolve(__dirname, "..", ".env"),
});

if (parsed.error) {
  throw new Error("You missed to create the required `.env` file");
}

const version = "1.0.0";

program
  .version(version)
  .command("hotfix <projectName> <branchName>")
  .description("create a hotfix for specific app")
  .option(
    "--manualBranchCreation",
    "it wont create a branch automatically. But you will create your self by runing the script returned",
    true
  )
  .action(hotfix);

program
  .version(version)
  .command("playJob <projectName> <branchName> <jobName>")
  .description(
    "will play specific job on the latest pipeline. Required arguments: <projectName> <branchName> <jobName>"
  )
  .option(
    "--viewJobOnly",
    "If you specify this value, it will just return the latest job only and wont trigger any job"
  )
  .action(playJob);

program.parse(process.argv);
