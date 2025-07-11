import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await prisma.user.findMany();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
