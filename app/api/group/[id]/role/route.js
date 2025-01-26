import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    logger.info("Attempting to fetch user role", { groupId: id, userId });

    if (!userId) {
      logger.warn("Missing userId parameter", { groupId: id });
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const result = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (!result.rows[0]) {
      logger.warn("User is not a group member", { groupId: id, userId });
      return NextResponse.json(
        { error: "User is not a group member" },
        { status: 404 }
      );
    }

    logger.info("Role fetched successfully", {
      groupId: id,
      userId,
      role: result.rows[0].rank,
    });

    return NextResponse.json({ rank: result.rows[0].rank });
  } catch (error) {
    logger.error("Error fetching role", {
      error: error.message,
      stack: error.stack,
      groupId: id,
      userId,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
