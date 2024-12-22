import { db } from "@/utils/db";
import { eq, isNull, or, and } from "drizzle-orm"; // Import 'and'
import { NextResponse } from "next/server";
import { STUDENTS, ATTENDANCE } from "@/db/schema";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const month = searchParams.get("month");
        const grade = searchParams.get("grade");

        const result = await db
            .select({
                name: STUDENTS.name,
                present: ATTENDANCE.present,
                day: ATTENDANCE.day,
                date: ATTENDANCE.date,
                grade: STUDENTS.grade,
                student_id: ATTENDANCE.student_id,
                attendance_id: ATTENDANCE.id,
            })
            .from(STUDENTS)
            .leftJoin(ATTENDANCE, and(eq(STUDENTS.id, ATTENDANCE.student_id), eq(ATTENDANCE.date, month)))
            .where(
              
                    eq(STUDENTS.grade, grade),
                 
            );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.student_id || !data.day || !data.present || !data.date) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        // Insert attendance into the database
        const result = await db.insert(ATTENDANCE).values({
            student_id: data.student_id,
            present: data.present,
            day: data.day,
            date: data.date, // Ensure this is formatted correctly
        });

        return NextResponse.json({ message: "Attendance created successfully", result }, { status: 201 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
       const student_id = searchParams.get("student_id");
       const day = searchParams.get("day");
       const date = searchParams.get("date");

        const result = await db.delete(ATTENDANCE).where(
            and(
                eq(ATTENDANCE.student_id, student_id),
                eq(ATTENDANCE.day, day),
                eq(ATTENDANCE.date, date)

            )
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}