import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle("postgresql://attendance-tracker_owner:vnrWQPiJL90G@ep-tight-bonus-a58s11f0-pooler.us-east-2.aws.neon.tech/attendance-tracker?sslmode=require");

export default db;