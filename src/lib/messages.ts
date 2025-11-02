import Prettify from "@/types/Prettify";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export default async function saveMessage(
  data: Prettify<
    Pick<Prisma.MessageCreateInput, "content" | "room" | "user" | "messageType">
  >
) {
  return prisma.message.create({
    data,
  });
}
