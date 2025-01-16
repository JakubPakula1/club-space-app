import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    const data = await req.json();
    const token = req.cookies.get("token");
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const field = Object.keys(data)[0];
    let value = data[field];

    if (field === "password") {
      value = await bcrypt.hash(value, 10);
    }

    const result = await query(
      `
      UPDATE users 
      SET ${field} = $1 
      WHERE id = $2 
      RETURNING *
    `,
      [value, userId]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Użytkownik nie znaleziony" },
        { status: 404 }
      );
    }

    const { password, ...userData } = result.rows[0];
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Błąd aktualizacji:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
