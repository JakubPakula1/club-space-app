import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing requred fields" },
        { status: 400 }
      );
    }

    const result = await query("", [name, description]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating group", error);
    return NextResponse.json(
      { error: "Internal Sever Error" },
      { status: 500 }
    );
  }
}
