"use server";

import { prisma } from "@/lib/prisma/prisma";
import { ExpandRecursively } from "@/types/Prettify";
import { Prisma } from "@prisma/client";

// Add this to your types file

const query = {
  include: {
    messages: {
      omit: { roomId: true },
      orderBy: { createdAt: "desc" },
      take: 1,
      include: { user: { select: { name: true } } },
    },
  },
  orderBy: {
    lastMessageAt: "desc",
  },
} satisfies Prisma.RoomFindManyArgs;

export async function fetchRoomList(userId: string) {
  const rooms = (await prisma.room.findMany({
    where: { users: { some: { id: userId } } },
    ...query,
  })) as ExpandRecursively<Prisma.RoomGetPayload<typeof query>>[];
  console.log(`fetched for user with id = ${userId}`);
  return rooms;
}
