import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";

export async function PATCH(req) {
  try {
    const data = await req.json();
    const token = req.cookies.get("token");
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const field = Object.keys(data)[0];
    let value = data[field];

    logger.info("Attempting to update user field", {
      userId,
      field,
      valueLength: value?.length || 0,
    });

    if (field === "password") {
      value = await bcrypt.hash(value, 10);
    }

    const result = await query(
      `UPDATE users SET ${field} = $1 WHERE id = $2 RETURNING *`,
      [value, userId]
    );

    if (!result.rows[0]) {
      logger.warn("User not found during update", { userId });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    logger.info("User updated successfully", {
      userId,
      field,
    });

    const { password, ...userData } = result.rows[0];
    return NextResponse.json(userData);
  } catch (error) {
    logger.error("Error updating user", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
