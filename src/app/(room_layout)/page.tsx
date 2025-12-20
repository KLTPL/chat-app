import { getSession } from "@/lib/auth";
import fetchRoomIdLatestMessage from "@/lib/prisma/roomIdLatestMessage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = (await getSession())!;

  const lastRoomPath = (await cookies()).get("last-room-path")?.value;
  if (lastRoomPath !== undefined) {
    redirect(lastRoomPath);
  }

  const roomIdLastMessage = await fetchRoomIdLatestMessage(session.user.id);

  if (roomIdLastMessage === null) {
    return (
      <div className="flex justify-center items-center h-full">
        Theres no room to display :(
      </div>
    );
  }
  redirect(`/room/${roomIdLastMessage}`);
}
