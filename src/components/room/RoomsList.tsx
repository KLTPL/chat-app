"use client";

import { fetchRoomList } from "@/server-actions/roomList.server";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RoomsList({ userId }: { userId: string }) {
  const [roomsList, setRoomsList] = useState<
    Awaited<ReturnType<typeof fetchRoomList>>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadMore() {
      const newRooms = await fetchRoomList(userId);
      setRoomsList(newRooms);
      setIsLoading(false);
    }
    loadMore();
  }, [userId]);

  return (
    <div className="grow">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        [...roomsList, ...roomsList, ...roomsList].map((room, id) => (
          <div key={id}>
            <Link href={`/room/${room.id}`}>{room.name}</Link>
          </div>
        ))
      )}
    </div>
  );
}
