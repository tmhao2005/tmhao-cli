import path from "path";
import fs from "fs";
import readline from "readline";
import { log, warn, success } from "../logger";
import { createHttp } from "../services/http";

async function portal() {
  const [urls, options] = arguments;

  if (options.file) {
    const filePath = path.resolve(options.file);
    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let portalUrls: string[] = [];
      for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        portalUrls.push(line.trim().replace(/^https?:\/\//, ""));
      }
      search(portalUrls);
    } else {
      warn("File %s no found", options.file);
    }
  } else {
    search(urls.split(","));
  }
}

async function search(urls: string[]) {
  // Assume # is kind of comment
  const portalUrls = urls.filter((elem) => elem && !elem.startsWith("#"));

  log(
    `the final list:\n\n${portalUrls.map((elem) => `"${elem}"`).join(",\n")}`
  );

  const http = createHttp(process.env.GO1_API);
  const results = await Promise.all(
    portalUrls.map(async (url) => {
      return http
        .get(`/portal/${url}`)
        .then((res) => ({ data: res.data, url }))
        .catch((e) => {
          warn(`warn ${url} has error: %s`, e.message);
          return null;
        });
    })
  );

  success(
    `Here you go:\n\n${results
      .map((elem) => (!elem ? null : `${elem.data.id}, # ${elem.url}`))
      .join("\n")}`
  );
  success(`${results.length} results returned`);
}

export default portal;
