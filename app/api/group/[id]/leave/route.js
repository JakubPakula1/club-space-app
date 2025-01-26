import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const token = req.cookies.get("token");

    if (!token) {
      logger.warn("Attempt to leave group without token", { groupId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to leave group", { userId, groupId: id });

    const memberCheck = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (!memberCheck.rows[0]) {
      logger.warn("Non-member attempted to leave group", {
        userId,
        groupId: id,
      });
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 404 }
      );
    }

    if (memberCheck.rows[0].rank === "owner") {
      logger.warn("Owner attempted to leave group", { userId, groupId: id });
      return NextResponse.json(
        { error: "Owner cannot leave the group" },
        { status: 403 }
      );
    }

    await query(
      "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    logger.info("User successfully left group", { userId, groupId: id });
    return NextResponse.json(
      { message: "Left group successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error while leaving group", {
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
