import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const KEY =
  "a15ddd7b7eb931f862aad1cb16380c506dc67babc28d9b499a0473d4c904f267c76940d513bbcbb8676b55bb214b01351144b6da411d6b302320e93b1196d411";

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
    const token = jwt.sign({ userId: user.id, username: user.name }, KEY, {
      expiresIn: "24h",
    });
    const response = NextResponse.json({
      token: token,
      success: true,
      user: {
        id: user.id,
        name: user.name,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
