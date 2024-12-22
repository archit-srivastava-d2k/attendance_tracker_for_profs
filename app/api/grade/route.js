import { GRADES } from '@/db/schema'
import { db } from '@/utils/db'
import { NextResponse } from 'next/server'
export async function GET(request) {
    const result = await db.select().from(GRADES)
    return NextResponse.json(result)
  }

