import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token");

    if (!token) {
      logger.warn("Attempt to delete post without token", { postId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Sprawdź czy użytkownik jest właścicielem grupy
    const ownerCheck = await query(
      `
      SELECT gm.rank 
      FROM posts p
      JOIN group_members gm ON p.group_id = gm.group_id
      WHERE p.id = $1 AND gm.user_id = $2
    `,
      [id, userId]
    );

    if (!ownerCheck.rows[0] || ownerCheck.rows[0].rank !== "owner") {
      logger.warn("Non-owner attempted to delete post", {
        userId,
        postId: id,
      });
      return NextResponse.json(
        { error: "Only owner can delete posts" },
        { status: 403 }
      );
    }

    // Usuń post
    await query("DELETE FROM posts WHERE id = $1", [id]);

    logger.info("Post deleted successfully", {
      userId,
      postId: id,
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error deleting post", {
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
