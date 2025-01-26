import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    logger.info("Attempting to fetch group details", { groupId: id });

    const groupResult = await query("SELECT * FROM groups WHERE id = $1;", [
      id,
    ]);
    const membersResult = await query(
      `SELECT u.id, u.name, u.description, gm.rank
       FROM users u
       JOIN group_members gm ON u.id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.rank DESC`,
      [id]
    );

    if (!groupResult.rows[0]) {
      logger.warn("Group not found", { groupId: id });
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    logger.info("Group details fetched successfully", {
      groupId: id,
      membersCount: membersResult.rows.length,
    });

    return NextResponse.json({
      group: groupResult.rows[0],
      members: membersResult.rows,
    });
  } catch (error) {
    logger.error("Error fetching group details", {
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

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const token = req.cookies.get("token");

    if (!token) {
      logger.warn("Attempt to delete group without token", { groupId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to delete group", { userId, groupId: id });

    const ownerCheck = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2 AND rank = 'owner'",
      [id, userId]
    );

    if (!ownerCheck.rows[0]) {
      logger.warn("Non-owner attempted to delete group", {
        userId,
        groupId: id,
      });
      return NextResponse.json(
        { error: "Only owner can delete the group" },
        { status: 403 }
      );
    }

    await query("DELETE FROM groups WHERE id = $1", [id]);

    logger.info("Group deleted successfully", { userId, groupId: id });
    return NextResponse.json(
      { message: "Group has been deleted" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error deleting group", {
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
