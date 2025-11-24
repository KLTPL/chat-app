import Prettify from "@/types/Prettify";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export default async function saveMessage(
  data: Prettify<
    Pick<Prisma.MessageCreateInput, "content" | "room" | "user" | "messageType">
  >
) {
  const resMessage = await prisma.message.create({
    data,
  });

  // Update room with new date of last message
  await prisma.room.update({
    where: { id: resMessage.roomId },
    data: { lastMessageAt: resMessage.createdAt },
  });

  return resMessage;
}
