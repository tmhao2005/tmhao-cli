declare module NodeJs {
  interface Global {}

  interface ProcessEnv {
    GITLAB_TOKEN: string;
    GO1_APP_ENDPOINT: string;
    GO1_APP_JWT: string;
  }
}

declare module "envfile" {
  export const parseFileSync: (path: string) => object;
  export const stringifySync: (obj: object) => string;
}
