import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getMQTTClient } from "@/lib/mqtt";
import logger from "@/lib/logger";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { content } = await req.json();
    const token = req.cookies.get("token");
    const mqttClient = getMQTTClient();

    if (!token) {
      logger.warn("Attempt to create post without token", { groupId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    logger.info("Attempting to create post", { userId, groupId: id });

    const memberCheck = await query(
      "SELECT rank FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (!memberCheck.rows[0]) {
      logger.warn("Non-member attempted to create post", {
        userId,
        groupId: id,
      });
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const result = await query(
      `INSERT INTO posts (group_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id, content, created_at`,
      [id, userId, content]
    );

    const groupResult = await query("SELECT name FROM groups WHERE id = $1", [
      id,
    ]);
    const groupName = groupResult.rows[0].name;

    mqttClient.publish(
      `group/${id}/posts`,
      JSON.stringify({
        type: "new_post",
        username: decoded.username,
        content: content,
        timestamp: new Date(),
        groupName: groupName,
      })
    );

    logger.info("Post created successfully", {
      userId,
      groupId: id,
      postId: result.rows[0].id,
    });

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    logger.error("Error creating post", {
      error: error.message,
      stack: error.stack,
      groupId: id,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    logger.info("Fetching posts for group", { groupId: id });

    const result = await query(
      `SELECT 
        p.id,
        p.content,
        p.created_at as timestamp,
        u.name as username,
        COUNT(l.id) as likes
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.group_id = $1
      GROUP BY p.id, p.content, p.created_at, u.name
      ORDER BY p.created_at DESC;
    `,
      [id]
    );

    logger.info("Posts fetched successfully", {
      groupId: id,
      count: result.rows.length,
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    logger.error("Error fetching posts", {
      error: error.message,
      stack: error.stack,
      groupId: id,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
