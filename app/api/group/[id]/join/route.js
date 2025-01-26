import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getMQTTClient } from "@/lib/mqtt";
import logger from "@/lib/logger";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token");
    const mqttClient = getMQTTClient();

    if (!token) {
      logger.warn("Attempt to join group without token", { groupId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to join group", { userId, groupId: id });

    const existingMember = await query(
      "SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (existingMember.rows[0]) {
      logger.info("User is already a group member", {
        userId,
        groupId: id,
      });
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 200 }
      );
    }

    await query(
      "INSERT INTO group_members (group_id, user_id, rank) VALUES ($1, $2, $3)",
      [id, userId, "member"]
    );

    mqttClient.subscribe(`group/${id}/posts`);
    logger.info("User successfully joined group", { userId, groupId: id });

    return NextResponse.json(
      { message: "Successfully joined group" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error while joining group", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
