import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getMQTTClient } from "@/lib/mqtt";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token");
    const mqttClient = getMQTTClient();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const existingMember = await query(
      "SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (existingMember.rows[0]) {
      return NextResponse.json(
        { error: "Już jesteś członkiem tej grupy" },
        { status: 200 }
      );
    }

    await query(
      "INSERT INTO group_members (group_id, user_id, rank) VALUES ($1, $2, $3)",
      [id, userId, "member"]
    );
    mqttClient.subscribe(`group/${id}/posts`, (err) => {
      if (!err) {
        console.log("zasubskrybowano");
      }
    });
    return NextResponse.json(
      { message: "Dołączono do grupy" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
