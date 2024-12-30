import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await query("SELECT name FROM users WHERE name = $1", [
      name,
    ]);

    if (existingUser.rows.length > 0) {
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

    const { password: _, ...userWithoutPassword } = result.rows[0];
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error registering:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
