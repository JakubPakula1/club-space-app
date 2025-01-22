import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Sprawdź rolę użytkownika w grupie
    const memberCheck = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (!memberCheck.rows[0]) {
      return NextResponse.json(
        { error: "Nie jesteś członkiem tej grupy" },
        { status: 404 }
      );
    }

    if (memberCheck.rows[0].rank === "owner") {
      return NextResponse.json(
        { error: "Właściciel nie może opuścić grupy" },
        { status: 403 }
      );
    }

    // Usuń użytkownika z grupy
    await query(
      "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    return NextResponse.json({ message: "Opuszczono grupę" }, { status: 200 });
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
