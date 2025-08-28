"use client";

import RoomForm from "@/components/room/RoomForm";
import RoomMessage from "@/components/room/RoomMessage";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import Message from "@/types/Message";
import SessionPayload from "@/types/SessionPayload";
import Prettify from "@/types/Prettify";

export default function RoomClient({
  roomId,
  user,
}: {
  roomId: string;
  user: Prettify<Pick<SessionPayload["user"], "id" | "name" | "username">>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    socket.emit("join-room", { roomId, user });
  }, [roomId, user]);
  useEffect(() => {
    socket.on("user_joined", message => {
      setMessages(prev => [...prev, { isFromSystem: true, message, user }]);
    });

    socket.on("message", (message: Message) => {
      console.log(message);
      setMessages(prev => [...prev, message]);
    });
    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  });
  function onSendMessage(message: string) {
    setMessages(prev => [...prev, { user, message, isFromSystem: false }]);
    socket.emit("message", { user, message, roomId });
  }
  return (
    <div className="flex mt-24 justify-center w-full">
      <div className="w-full max-w-[500px] border p-3 rounded-md">
        <h2>Room: {roomId}</h2>
        <div>
          {messages.map((msgObj, idx) => (
            <RoomMessage
              isFromSystem={msgObj.isFromSystem}
              message={msgObj.message}
              user={msgObj.user}
              isOwnMessage={user.id === msgObj.user.id}
              key={idx}
            />
          ))}
          <RoomForm onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
}
