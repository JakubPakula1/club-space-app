import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, userId } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing requred fields" },
        { status: 400 }
      );
    }

    // Rozpocznij transakcję
    await query("BEGIN");

    // Utwórz grupę
    const groupResult = await query(
      "INSERT INTO groups (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, userId]
    );

    // Dodaj twórcę jako członka grupy
    await query(
      "INSERT INTO group_members (group_id, user_id, rank) VALUES ($1, $2, $3)",
      [groupResult.rows[0].id, userId, "owner"]
    );

    // Zatwierdź transakcję
    await query("COMMIT");
    return NextResponse.json(groupResult.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating group", error);
    return NextResponse.json(
      { error: "Internal Sever Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const result = await query("SELECT * FROM groups;");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups", error);
    return NextResponse.json(
      { error: "Internal Sever Error" },
      { status: 500 }
    );
  }
}
