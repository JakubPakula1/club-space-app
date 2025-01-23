import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const ownerCheck = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2 AND rank = 'owner'",
      [id, userId]
    );

    if (!ownerCheck.rows[0]) {
      return NextResponse.json(
        { error: "Tylko właściciel może usunąć grupę" },
        { status: 403 }
      );
    }

    await query("DELETE FROM groups WHERE id = $1", [id]);

    return NextResponse.json(
      { message: "Grupa została usunięta" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
