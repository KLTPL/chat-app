"use server";

import { prisma } from "@/lib/prisma";
import Prettify from "@/types/Prettify";
import { Prisma } from "@prisma/client";

export async function createNewRoom(
  data: Prettify<
    Pick<Prisma.RoomCreateInput, "name" | "users" | "administrators">
  >
) {
  const room = await prisma.room.create({
    data,
  });
  console.log("room", room.id, "created");
  return room;
}
