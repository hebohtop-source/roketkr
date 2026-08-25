import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

declare global {
  var _dbPool: mysql.Pool | undefined;
}

const client =
  global._dbPool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL!,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  global._dbPool = client;
}

export const db = drizzle(client, { schema, mode: "default" });
