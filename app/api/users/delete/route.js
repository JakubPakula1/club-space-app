import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token");

    if (!token) {
      logger.warn("Attempt to delete account without token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to delete account", { userId });

    await query("DELETE FROM users WHERE id = $1", [userId]);

    logger.info("Account deleted successfully", { userId });

    const response = NextResponse.json(
      { message: "Account has been deleted" },
      { status: 200 }
    );

    response.cookies.delete("token");

    return response;
  } catch (error) {
    logger.error("Error deleting account", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
