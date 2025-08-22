import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await prisma.room.findMany();
    // const res = await prisma.room.update({
    //   where: { id: "81788b00-fa4a-4013-b8a0-a5eea259dac3" },
    //   data: {
    //     users: { connect: { id: "51db7463-ebbf-44c2-b2c2-ef9d19eced37" } },
    //   },
    // });
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
