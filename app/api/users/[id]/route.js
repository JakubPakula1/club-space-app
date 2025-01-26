import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import logger from "@/lib/logger";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    logger.info("Attempting to fetch user", { userId: id });

    const result = await query("SELECT * FROM users WHERE id = $1", [id]);

    if (!result.rows[0]) {
      logger.warn("User not found", { userId: id });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    logger.info("User fetched successfully", { userId: id });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    logger.error("Error fetching user", {
      error: error.message,
      stack: error.stack,
      userId: id,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
