import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const result = await query(
      `
      SELECT m.*, u.name as username 
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.group_id = $1
      ORDER BY m.created_at ASC
    `,
      [id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { content } = await req.json();
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const result = await query(
      "INSERT INTO messages (group_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [id, userId, content]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
