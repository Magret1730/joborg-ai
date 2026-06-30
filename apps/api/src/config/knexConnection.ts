export function getKnexConnection(databaseUrl?: string) {
  const connectionString = databaseUrl ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const requiresSsl =
    process.env.NODE_ENV === "production" ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=require");

  return {
    connectionString,
    ssl: requiresSsl ? { rejectUnauthorized: false } : false,
  };
}

export function isDatabaseConfigured(databaseUrl?: string) {
  return Boolean(databaseUrl ?? process.env.DATABASE_URL);
}
