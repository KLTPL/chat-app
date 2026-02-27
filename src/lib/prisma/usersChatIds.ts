import { prisma } from "./prisma";

export default async function fetchUsersChatIds(userId: string) {
  const res = await prisma.room.findMany({
    select: { id: true },
    where: { users: { some: { id: userId } } },
  });
  return res.map(obj => obj.id);
}
