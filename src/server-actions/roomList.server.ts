"use server";

import { prisma } from "@/lib/prisma";

export async function fetchRoomList(
  userId: string,
  skip: number,
  take: number
) {
  const rooms = await prisma.room.findMany({
    where: { users: { some: { id: userId } } },
    skip,
    take,
  });
  console.log(
    `fetched ${take} rooms starting from ${skip} for user with id = ${userId}`
  );
  return rooms;
}
