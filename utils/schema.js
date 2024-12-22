import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const GRADES = pgTable("grades", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  grade:varchar('grade',{ length: 255 }).notNull(),
});

export const STUDENTS = pgTable("students",{ 
  grade:varchar('grade').notNull(), 
  name:varchar('name',{maxlen:20}).notNull(),
  contact:integer('contact',{len:11}),
  address:varchar('address',{maxlen:50}),

})
