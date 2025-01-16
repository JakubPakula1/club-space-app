import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await query("SELECT id, name FROM users WHERE id = $1", [
      id,
    ]);

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Użytkownik nie znaleziony" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Błąd pobierania danych:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
