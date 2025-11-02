"use client";

import { createNewRoom } from "@/server-actions/newRoom.server";
import { Button } from "../ui/button";

export default function NewRoomButton({ userId }: { userId: string }) {
  return (
    <Button
      onClick={async () => {
        const roomName = prompt("Provide room name");

        await createNewRoom({
          name: roomName || "Super new room",
          users: { connect: [{ id: userId }] },
          administrators: { connect: [{ id: userId }] },
        });
      }}
    >
      New Room
    </Button>
  );
}
