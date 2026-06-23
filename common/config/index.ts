//

export const PRODUCTION: boolean = (process.env.NODE_ENV ===
  "production") as false;

//
export const PROD_DATABASE: boolean = (
  process.env.PROD_DATABASE == null
    ? PRODUCTION
    : Boolean(process.env.PROD_DATABASE)
) as false;
