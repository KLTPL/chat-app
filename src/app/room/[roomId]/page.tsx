import NewRoomButton from "@/components/room/NewRoomButton";
import RoomClient from "@/components/room/RoomClient";
import RoomsList from "@/components/room/RoomsList";
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
    <div className="flex h-full">
      <section className="w-[25%] border-r-2">
        <NewRoomButton userId={session.user.id} />
        <RoomsList userId={session.user.id} />
      </section>
      <section className="grow">
        <RoomClient roomId={roomId} username={session.user.username} />
      </section>
    </div>
  );
}
