import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token");

    if (!token) {
      logger.warn("Attempt to like post without token", { postId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to toggle like", { userId, postId: id });

    const existingLike = await query(
      "SELECT id FROM likes WHERE post_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (existingLike.rows[0]) {
      await query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [
        id,
        userId,
      ]);
      logger.info("Like removed successfully", { userId, postId: id });
      return NextResponse.json({ liked: false });
    }

    await query("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [
      id,
      userId,
    ]);

    logger.info("Like added successfully", { userId, postId: id });
    return NextResponse.json({ liked: true });
  } catch (error) {
    logger.error("Error toggling like", {
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
