"use client";

import { fetchRoomList } from "@/server-actions/roomList.server";
import { Button } from "../ui/button";
import { useState } from "react";

export default function RoomsList({ userId }: { userId: string }) {
  const [roomsList, setRoomsList] = useState<
    Awaited<ReturnType<typeof fetchRoomList>>
  >([]);
  async function loadMore() {
    const newRooms = await fetchRoomList(userId, 0, 10);
    return newRooms;
  }
  return (
    <div>
      <Button
        onClick={async () => {
          const newRooms = await loadMore();
          setRoomsList(prev => [...prev, ...newRooms]);
        }}
      >
        Load More
      </Button>
      {JSON.stringify(roomsList)}
    </div>
  );
}
