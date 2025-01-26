import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    logger.info("Fetching messages for group", { groupId: id });

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

    logger.info("Messages fetched successfully", {
      groupId: id,
      count: result.rows.length,
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    logger.error("Error fetching messages", {
      error: error.message,
      stack: error.stack,
      groupId: id,
    });
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
      logger.warn("Attempt to send message without token", { groupId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to save message", {
      userId,
      groupId: id,
    });

    const result = await query(
      "INSERT INTO messages (group_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [id, userId, content]
    );

    logger.info("Message saved successfully", {
      userId,
      groupId: id,
      messageId: result.rows[0].id,
    });

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    logger.error("Error saving message", {
      error: error.message,
      stack: error.stack,
      groupId: id,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
