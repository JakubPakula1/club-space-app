import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import logger from "@/lib/logger";

export async function POST(req) {
  try {
    const { name, password } = await req.json();

    logger.info("Registration attempt", { username: name });

    if (!name || !password) {
      logger.warn("Missing required fields in registration", {
        name: !!name,
        password: !!password,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await query("SELECT name FROM users WHERE name = $1", [
      name,
    ]);

    if (existingUser.rows.length > 0) {
      logger.warn("Registration attempt with existing username", {
        username: name,
      });
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *",
      [name, hashedPassword]
    );

    logger.info("User registered successfully", {
      userId: result.rows[0].id,
      username: name,
    });

    const { password: _, ...userWithoutPassword } = result.rows[0];
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    logger.error("Error during registration", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
