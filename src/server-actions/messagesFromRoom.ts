"use server";
import { prisma } from "@/lib/prisma/prisma";

export async function fetchMessagesFromRoom(
  roomId: string,
  take: number,
  skip: number
) {
  const messages = await prisma.message.findMany({
    omit: {
      roomId: true,
      userId: true,
    },
    where: { roomId: roomId },
    include: { user: { select: { name: true, username: true, id: true } } },
    take,
    skip,
    orderBy: { createdAt: "desc" },
  });
  return messages.reverse();
}
