import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getMQTTClient } from "@/lib/mqtt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, userId } = body;

    logger.info("Attempting to create group", { userId, name });

    if (!name || !description) {
      logger.warn("Missing required fields in group creation", {
        name: !!name,
        description: !!description,
        userId,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
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

    logger.info("Group created successfully", {
      groupId: groupResult.rows[0].id,
      userId,
      name,
    });

    const mqttClient = getMQTTClient();
    mqttClient.publish(
      "groups/new",
      JSON.stringify({
        id: groupResult.rows[0].id,
        name: groupResult.rows[0].name,
        description: groupResult.rows[0].description,
      })
    );

    return NextResponse.json(groupResult.rows[0], { status: 201 });
  } catch (error) {
    logger.error("Error creating group", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("search");

    logger.info("Fetching groups", { searchTerm });

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

    logger.info("Groups fetched successfully", { count: result.rows.length });
    return NextResponse.json(result.rows);
  } catch (error) {
    logger.error("Error fetching groups", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
