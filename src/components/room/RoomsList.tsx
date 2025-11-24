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
        roomsList.map((room, id) => (
          <div key={id}>
            <Link
              href={`/room/${room.id}`}
              className="flex flex-col hover:bg-gray-300 py-1 px-2 rounded-sm"
            >
              <div className="font-bold">{room.name}</div>
              {room.messages.length === 0 ? ( // if room.messages.length > 0 theres only one message (the last one)
                <div className="text-sm text-nowrap italic">
                  New room created
                </div>
              ) : (
                <div className="text-sm text-nowrap">
                  {room.messages[0].user.name}: {room.messages[0].content}
                </div>
              )}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
