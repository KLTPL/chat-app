"use server";
import { prisma } from "@/lib/prisma/prisma";

export async function fetchMessagesFromRoom(roomId: string) {
  const messages = await prisma.message.findMany({
    omit: {
      roomId: true,
      userId: true,
    },
    where: { roomId: roomId },
    include: { user: { select: { name: true, username: true, id: true } } },
    orderBy: { createdAt: "asc" },
  });
  return messages;
}
