import RoomsList from "@/components/room/RoomsList";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = (await getSession())!;

  return (
    <div>
      <RoomsList userId={session.user.id} />
    </div>
  );
}
