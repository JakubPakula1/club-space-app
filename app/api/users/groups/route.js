import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    const result = await query(
      `
        SELECT g.*, gm.rank 
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
      `,
      [userId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error creating group", error);
    return NextResponse.json(
      { error: "Internal Sever Error" },
      { status: 500 }
    );
  }
}
