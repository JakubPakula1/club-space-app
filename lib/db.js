import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "clubspace",
  password: "250804",
  port: 5432,
});

export const query = (text, params) => pool.query(text, params);
