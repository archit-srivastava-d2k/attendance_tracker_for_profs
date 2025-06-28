import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://attendance-tracker_owner:vnrWQPiJL90G@ep-tight-bonus-a58s11f0-pooler.us-east-2.aws.neon.tech/attendance-tracker?sslmode=require",
  },
});
