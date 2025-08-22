"use server";

import { prisma } from "@/lib/prisma";

export async function fetchRoomList(userId: string) {
  const rooms = await prisma.room.findMany({
    where: { users: { some: { id: userId } } },

    orderBy: { lastMessageAt: "desc" },
  });
  console.log(`fetched for user with id = ${userId}`);
  return rooms;
}
