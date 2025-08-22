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
      setRoomsList(prev => [...prev, ...newRooms]);
      setIsLoading(false);
    }
    loadMore();
  }, [userId]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        roomsList.map(room => (
          <div key={room.id}>
            <Link href={`/room/${room.id}`}>{room.id}</Link>
          </div>
        ))
      )}
    </div>
  );
}
