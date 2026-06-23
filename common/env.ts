import { type, ArkErrors } from "arktype";

const envSchema = type({
  PORT: type("string")
    .pipe((s) => parseInt(s))
    .to("number")
    .default("3000"),
  SERVER_PORT: type("string")
    .pipe((s) => parseInt(s))
    .to("number")
    .default("4000"),
  "USE_PROD_DATABASE?": "boolean",
  DATABASE_FILE_NAME: "string",
  DATABASE_URL: "string",
  "NEXT_PUBLIC_APP_URL?": "string.url",
  BETTER_AUTH_SECRET: "string",
  BETTER_AUTH_URL: "string.url",
  BETTER_AUTH_TRUSTED_ORIGINS: type("string")
    .pipe((s) => JSON.parse(s))
    .to("string.url[]"),
  "GOOGLE_CLIENT_ID?": "string",
  "GOOGLE_CLIENT_SECRET?": "string",
});

export const env = envSchema.assert(process.env);
