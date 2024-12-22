import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgresql://attendance-tracker_owner:vnrWQPiJL90G@ep-tight-bonus-a58s11f0-pooler.us-east-2.aws.neon.tech/attendance-tracker?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool); 