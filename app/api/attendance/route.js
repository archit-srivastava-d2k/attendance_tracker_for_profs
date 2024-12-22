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
            .leftJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.student_id))
            .where(
                and(
                    eq(STUDENTS.grade, grade),
                    or(eq(ATTENDANCE.date, month), isNull(ATTENDANCE.date))
                )
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
        const result = await db.insert(ATTENDANCE).values({
            student_id: data.student_id,
            present: data.present,
            day: data.day,
            date: data.date,
        });

        return NextResponse.json({ message: "Attendance created successfully", result }, { status: 201 });

    }
    catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
