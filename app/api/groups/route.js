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

    await query("BEGIN");

    const groupResult = await query(
      "INSERT INTO groups (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, userId]
    );

    await query(
      "INSERT INTO group_members (group_id, user_id, rank) VALUES ($1, $2, $3)",
      [groupResult.rows[0].id, userId, "owner"]
    );

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
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("search");

    let queryString = "SELECT * FROM groups";
    let queryParams = [];

    if (searchTerm) {
      queryString = `
        SELECT * FROM groups 
        WHERE name LIKE $1 
        OR description LIKE $1
      `;
      queryParams = [`%${searchTerm}%`];
    }

    const result = await query(queryString, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
