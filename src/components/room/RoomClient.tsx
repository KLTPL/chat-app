"use client";

import RoomForm from "@/components/room/RoomForm";
import RoomMessage from "@/components/room/RoomMessage";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import Message from "@/types/Message";

export default function RoomClient({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    socket.emit("join-room", { roomId, username });
  }, [roomId, username]);
  useEffect(() => {
    socket.on("user_joined", message => {
      setMessages(prev => [
        ...prev,
        { isFromSystem: true, message, sender: "" },
      ]);
    });

    socket.on("message", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });
    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  });
  function onSendMessage(message: string) {
    setMessages(prev => [
      ...prev,
      { sender: username, message, isFromSystem: false },
    ]);
    socket.emit("message", { sender: username, message, roomId });
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
              sender={msgObj.sender}
              isOwnMessage={username === msgObj.sender}
              key={idx}
            />
          ))}
          <RoomForm onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
}
