import NewRoomButton from "@/components/room/NewRoomButton";
import RoomsList from "@/components/room/RoomsList";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = (await getSession())!;

  return (
    <div className="flex justify-center items-center h-full">
      <NewRoomButton userId={session.user.id} />
      <RoomsList userId={session.user.id} />
    </div>
  );
}
