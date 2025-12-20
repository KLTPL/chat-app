import NewRoomButton from "@/components/room/NewRoomButton";
import RoomsList from "@/components/room/RoomsList";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    //should not happen
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[25%] h-full flex flex-col border-r-2 overflow-y-auto">
        <NewRoomButton userId={session.user.id} />
        <RoomsList userId={session.user.id} />
      </aside>
      <main className="grow h-screen">{children}</main>
    </div>
  );
}
