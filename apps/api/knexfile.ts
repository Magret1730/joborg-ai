import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

function getKnexConnection() {
  const connectionString = process.env.DATABASE_URL;

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

const config: Record<string, Knex.Config> = {
  development: {
    client: "pg",
    connection: getKnexConnection(),
    migrations: {
      directory: "./src/db/migrations",
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: getKnexConnection(),
    migrations: {
      directory: "./dist/db/migrations",
      extension: "js",
    },
  },
};

export default config;
