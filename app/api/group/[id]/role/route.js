import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Brak userId" }, { status: 400 });
    }

    const result = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Użytkownik nie jest członkiem grupy" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rank: result.rows[0].rank });
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
