import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function GET(request) {
  try {
    const cookieStore = request.cookies;
    const token = cookieStore.get("token");

    if (!token) {
      logger.warn("Auth attempt without token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    logger.info("User authenticated successfully", {
      userId: decoded.userId,
      username: decoded.username,
    });

    return NextResponse.json({
      user: {
        id: decoded.userId,
        username: decoded.username,
      },
    });
  } catch (error) {
    logger.error("Auth verification failed", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
