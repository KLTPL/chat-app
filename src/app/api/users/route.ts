import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM users");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
