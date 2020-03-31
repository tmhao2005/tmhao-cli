import * as qs from "query-string";
import { warn, success } from "../logger";

export async function genPlayerLink() {
  const [link, playingPath] = arguments;

  const url = new URL(link);

  const LOCAL_DOMAIN = "http://localhost:3000";
  const pathRE = /^\/+|\/+$/g;
  const hashRE = /.+\?(.+)/g;

  const query = qs.parse(url.hash.replace(hashRE, "$1"));

  if (!("token" in query)) {
    warn("Link is missing token");
    return;
  }

  const path = playingPath.replace(pathRE, "");
  const portal = "portal_name" in query ? query.portal_name : url.host;

  const genLink = `${LOCAL_DOMAIN}/${path}?token=${query.token}&portal=${portal}`;

  success(genLink);
}
