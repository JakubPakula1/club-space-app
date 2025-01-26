import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    logger.info("Fetching user groups", { userId });

    const result = await query(
      `
        SELECT g.*, gm.rank 
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
      `,
      [userId]
    );

    logger.info("Groups fetched successfully", {
      userId,
      count: result.rows.length,
    });

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    logger.error("Error fetching user groups", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
