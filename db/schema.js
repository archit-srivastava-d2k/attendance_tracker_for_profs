import { int } from "drizzle-orm/mysql-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const GRADES = pgTable("grades", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  grade:varchar('grade',{ length: 255 }).notNull(),
});

export const STUDENTS = pgTable("students",{
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  
  grade:varchar('grade').notNull(),

  name:varchar('name',{maxlen:20}).notNull(), 
  contact: varchar('contact', { maxlen: 15 }), // Storing phone numbers as strings

  address:varchar('address',{maxlen:50}),
})

export const ATTENDANCE = pgTable("attendance",{
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  student_id:integer('student_id').notNull(),
  present:varchar('present').default('absent'),
  day:integer('day').notNull(),
  date:varchar('date').notNull(),

})

