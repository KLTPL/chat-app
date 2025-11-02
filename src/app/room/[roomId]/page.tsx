import RoomClient from "@/components/room/RoomClient";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const session = await getSession();
  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!session || !room) {
    notFound();
  }
  return (
    <RoomClient roomId={roomId} roomName={room.name} user={session.user} />
  );
}
