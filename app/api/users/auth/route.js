import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const cookieStore = request.cookies;
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    return NextResponse.json({
      user: {
        id: decoded.userId,
        username: decoded.username,
      },
    });
  } catch (error) {
    console.error("Auth verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
