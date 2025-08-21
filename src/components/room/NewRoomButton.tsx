"use client";

import { createNewRoom } from "@/server-actions/newRoom.server";
import { Button } from "../ui/button";

export default function NewRoomButton({ userId }: { userId: string }) {
  return (
    <Button
      onClick={async () => {
        const roomName = prompt("Podaj nazwę pokoju");

        await createNewRoom({
          name: roomName || "super nowy room",
          users: { connect: [{ id: userId }] },
          administrators: { connect: [{ id: userId }] },
        });
      }}
    >
      Nowy Czat
    </Button>
  );
}
