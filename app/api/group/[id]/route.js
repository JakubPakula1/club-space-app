import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const groupResult = await query("SELECT * FROM groups WHERE id = $1;", [
      id,
    ]);

    const membersResult = await query(
      `
      SELECT u.id, u.name, u.description, gm.rank
      FROM users u
      JOIN group_members gm ON u.id = gm.user_id
      WHERE gm.group_id = $1
      ORDER BY gm.rank DESC
    `,
      [id]
    );
    if (!groupResult.rows[0]) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({
      group: groupResult.rows[0],
      members: membersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
