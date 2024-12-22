import { STUDENTS } from "@/db/schema"
import { db } from "@/utils/db"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const data = await req.json()

        console.log("Received Data:", data)

        if (!data.name || !data.grade || !data.contact || !data.address) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 })
        }

        const result = await db.insert(STUDENTS).values(
            {
                name: data.name,
                grade: data.grade,
                contact: data.contact,
                address: data.address
            }
        )

        console.log("Insert Result:", result)

        return NextResponse.json({ message: "Student created successfully", result }, { status: 201 })
    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req) {
    try {
        const result = await db.select().from(STUDENTS)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
      const { id } = await req.json();
      const result = await db.delete(STUDENTS).where(eq(STUDENTS.id, id));
      return NextResponse.json(result);
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }