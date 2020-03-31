#!/usr/bin/env node

import { resolve } from "path";
import { config } from "dotenv";
import * as program from "commander";
import { hotfix } from "./actions/hotfix";
import { playJob } from "./actions/playJob";
import { genPlayerLink } from "./actions/genPlayerLink";

const parsed = config({
  path: resolve(__dirname, "..", ".env"),
});

if (parsed.error) {
  throw new Error("You missed to create the required `.env` file");
}

const version = "1.0.0";

program
  .version(version)
  .command("hotfix-branch <projectName> <branchName>")
  .description("create a hotfix for specific app")
  .option(
    "-b, --branchCreation",
    "it wont create a branch automatically. But you will create your self by runing the script returned",
    false
  )
  .action(hotfix);

program
  .version(version)
  .command("job <projectName> <branchName> <jobName>")
  .description(
    "will play specific job on the latest pipeline. Required arguments: <projectName> <branchName> <jobName>"
  )
  .option("-p, --play", "Will trigger the job", false)
  .action(playJob);

program
  .command("player-local-link <link> <playingPath>")
  .description("Will generate a localhost link from production link")
  .action(genPlayerLink);

program.parse(process.argv);
