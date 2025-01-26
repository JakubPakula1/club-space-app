import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import logger from "@/lib/logger";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("token");
    logger.info("User logged out successfully");

    return response;
  } catch (error) {
    logger.error("Error during logout", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
