import { prisma } from "./prisma";

export default async function fetchRoomIdLatestMessage(userId: string) {
  const res = await prisma.room.findFirst({
    where: { users: { some: { id: userId } } },
    select: { id: true },
    orderBy: { lastMessageAt: "desc" },
  });
  return res === null ? null : res.id;
}
