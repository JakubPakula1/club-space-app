import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, password } = await req.json();

    const result = await query("SELECT * FROM users WHERE name = $1", [name]);

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Invalid login or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
