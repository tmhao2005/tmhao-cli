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

program
  .version("1.0.0")
  .command("hotfix <projectName> <branchName>")
  .description("create a hotfix for specific app")
  .action(hotfix);

program
  .command("playJob <projectName> <branchName> <jobName> [checkOnly]")
  .description("will play specific job on the latest pipeline")
  .action(playJob);

program.parse(process.argv);
