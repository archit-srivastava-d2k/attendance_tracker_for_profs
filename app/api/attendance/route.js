import { db } from "@/utils/db";
import { eq, isNull, or, and } from "drizzle-orm"; // Import 'and'
import { NextResponse } from "next/server";
import { STUDENTS, ATTENDANCE } from "@/db/schema";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const month = searchParams.get("month");
        const grade = searchParams.get("grade");

        // Ensure that the month and grade are provided
        if (!month || !grade) {
            return NextResponse.json({ error: "Month and grade are required." }, { status: 400 });
        }

        const result = await db
    .select({
        name: STUDENTS.name,
        present: ATTENDANCE.present,
        day: ATTENDANCE.day,
        date: ATTENDANCE.date,
        grade: STUDENTS.grade,
        student_id: STUDENTS.id, // Use STUDENTS.id directly
        attendance_id: ATTENDANCE.id,
    })
    .from(STUDENTS)
    .leftJoin(
        ATTENDANCE,
        and(eq(STUDENTS.id, ATTENDANCE.student_id), eq(ATTENDANCE.date, month))
    )
    .where(eq(STUDENTS.grade, grade));
        console.log("Fetched attendance data:", result); // Debugging log

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        // Insert attendance into the database
        const result = await db.insert(ATTENDANCE).values({
            student_id: data.student_id,
            present: data.present,
            day: data.day,
            date: data.date, // Ensure this is formatted correctly
        });
        console.log("student_id", data.student_id);

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