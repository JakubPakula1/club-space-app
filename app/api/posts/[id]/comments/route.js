import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    logger.info("Fetching comments for post", { postId: id });

    const result = await query(
      `SELECT 
          c.id,
          c.content,
          c.created_at,
          u.name as username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at DESC`,
      [id]
    );

    logger.info("Comments fetched successfully", {
      postId: id,
      count: result.rows.length,
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    logger.error("Error fetching comments", {
      error: error.message,
      stack: error.stack,
      postId: id,
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
      logger.warn("Attempt to create comment without token", { postId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to create comment", { userId, postId: id });

    const result = await query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [id, userId, content]
    );

    const commentWithUser = await query(
      `SELECT c.*, u.name as username 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );

    logger.info("Comment created successfully", {
      userId,
      postId: id,
      commentId: result.rows[0].id,
    });

    return NextResponse.json(commentWithUser.rows[0], { status: 201 });
  } catch (error) {
    logger.error("Error creating comment", {
      error: error.message,
      stack: error.stack,
      postId: id,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
