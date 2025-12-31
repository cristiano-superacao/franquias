export type EnvReport = {
  databaseUrl: boolean;
  railwayDatabaseUrl: boolean;
  nodeEnv: string | undefined;
  allowDbSync: boolean;
};

export function getEnvReport(): EnvReport {
  const nodeEnv = process.env.NODE_ENV;
  const databaseUrl = !!process.env.DATABASE_URL;
  const railwayDatabaseUrl = !!process.env.RAILWAY_DATABASE_URL;
  const allowDbSync = (process.env.ALLOW_DB_SYNC || "").toLowerCase() === "true";
  return { databaseUrl, railwayDatabaseUrl, nodeEnv, allowDbSync };
}
