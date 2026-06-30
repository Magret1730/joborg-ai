import type { Knex } from "knex";
import knex from "knex";
import { env } from "./env.js";
import { getKnexConnection, isDatabaseConfigured } from "./knexConnection.js";

let db: Knex | null = null;

export function getDb(): Knex {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!db) {
    db = knex({
      client: "pg",
      connection: getKnexConnection(env.databaseUrl),
      pool: {
        min: 0,
        max: 10,
      },
    });
  }

  return db;
}

export async function testDatabaseConnection() {
  const database = getDb();
  await database.raw("select 1");
}

export function isDbConfigured() {
  return isDatabaseConfigured(env.databaseUrl);
}

export async function closeDb() {
  if (db) {
    await db.destroy();
    db = null;
  }
}
