import { connect } from "mongoose";
import inquirer from "inquirer";
import User from "../models/User";
import { createHttp } from "../services/http";

type EnvType = "dev" | "qa" | "prod";

export async function masquerade(
  emailOrID: string,
  portalUrl: string,
  options: any
) {
  await connect("mongodb://localhost:27017/go1");
  const user = await User.findOne({
    username: emailOrID,
  });
  // console.log(emailOrID, portalUrl, options.env);

  if (user) {
    // Token
  } else {
    inquirer
      .prompt([
        {
          type: "input",
          name: "token",
          message: "Give me your JWT from staff?",
        },
      ])
      .then(async (token) => {
        const { data } = await requestMasq(options.env, token);
        // console.log(data);
        process.exit();
      });
  }
}

function createStaffHTTP(env: EnvType) {
  const baseUrl = process.env[`STAFF_API_${env.toUpperCase()}`];
  if (!baseUrl) {
    throw new Error("no staff url set");
  }
  console.log(baseUrl);
  return createHttp(baseUrl);
}

function requestMasq(env: EnvType, token: string) {
  const http = createStaffHTTP(env);
  // It seems to be impossible due to 2FA from staff
  http.setJWT(token);

  return http.get(`/user/588694/masquerade/public.mygo1.com`);
}
