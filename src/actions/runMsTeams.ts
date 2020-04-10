import * as ngrok from "ngrok";
import * as envfile from "envfile";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { success, warn, log } from "../logger";
import { GO1ClientService } from "../services/go1-client";

export async function runMsTeams(): Promise<void> {
  const [botDir, appDir, manifestDir] = arguments;

  const botPath = path.resolve(botDir);
  const appPath = path.resolve(appDir);
  const manifestPath = path.resolve(manifestDir);

  if (!isExisted(botPath) || !isExisted(appPath) || !isExisted(manifestPath)) {
    return;
  }

  // Run ngrok
  const botPublicUrl = await ngrok.connect({
    addr: 4000,
    authtoken: process.env.NGROK_TOKEN,
  });
  success("generated BOT url: %s", botPublicUrl);

  const appPublicUrl = await ngrok.connect({
    addr: 3000,
    authtoken: process.env.NGROK_TOKEN,
  });
  success("generated app url: %s", appPublicUrl);

  // Register app client with specific ngrok url
  const clientService = new GO1ClientService();

  log("Creating GO1 app...");
  const appName = `App-${Math.floor(Math.random() * 9999)}`;
  const appInfo = await clientService.createBotApp({
    name: appName,
    baseUri: botPublicUrl,
  });
  success("App created with ID: %s", appInfo.client_id);

  // Modify ".env" in BOT dir
  log(`Try to modify ".env" in ${botPath}...`);
  updateEnvFile(botPath, {
    GO1_CLIENT: appInfo.client_id,
    GO1_CLIENT_SECRET: appInfo.client_secret,
    GO1_APP_NAME: appInfo.client_name,
    EDUBOT_HOST: new URL(botPublicUrl).hostname,
  });
  success("Successfully to change BOT env file");

  // Modify in Manifest & run to create manifest
  updateEnvFile(
    manifestPath,
    {
      LEARNING_TAB_URL: `${appPublicUrl}/edu/app/my-learning`,
      LEARNING_TAB_CONFIG_URL: `${appPublicUrl}/edu/app/config`,
    },
    ".env.local"
  );

  // Run build zip file
  logProcess(
    spawn("yarn build", {
      shell: true,
      cwd: manifestPath,
    })
  );

  // Wont work with this way
  // exec(`yarn --cwd ${botDir} install`, (error, stdout, stderr) => {});
  // Run docker???
  const lsBot = spawn("yarn dev", {
    shell: true,
    cwd: botPath,
  });
  logProcess(lsBot);

  const lsApp = spawn("yarn dev", {
    shell: true,
    cwd: appPath,
  });
  logProcess(lsApp);

  const azureLink = 'https://portal.azure.com/#@9a96b5a7-f146-4358-99cf-7bf5dc78cec3/resource/subscriptions/71edaf39-28d0-4215-b381-f0efbff46637/resourceGroups/Agents/providers/Microsoft.BotService/botServices/Hao_Bot/settings';
  success(`Finally, Please visit the link, change "Messaging endpoint" to: "${botPublicUrl}/edu/api/messages": ${azureLink}`);
}

function isExisted(dir: string) {
  if (fs.existsSync(dir)) {
    success("Found dir: %s", dir);
    return true;
  }

  return false;
}

function logProcess(ls: ChildProcessWithoutNullStreams) {
  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function updateEnvFile(
  appPath: string,
  changes: object,
  customFileName: string = ".env"
) {
  const envFilePath = path.join(appPath, customFileName);
  const parsed = envfile.parseFileSync(envFilePath);

  changes = {
    ...parsed,
    ...changes,
  };

  fs.writeFileSync(envFilePath, envfile.stringifySync(changes));

  return changes;
}