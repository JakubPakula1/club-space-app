import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Wylogowano pomyślnie" },
      { status: 200 }
    );

    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Błąd wylogowania:", error);
    return NextResponse.json(
      { error: "Błąd podczas wylogowania" },
      { status: 500 }
    );
  }
}
