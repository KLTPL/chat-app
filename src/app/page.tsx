"use client";

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import Message from "@/types/Message";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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
  function handleJoinRoom(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (room !== "" && username !== "") {
      socket.emit("join-room", { room, username });
      setJoined(true);
    }
  }
  function onSendMessage(message: string) {
    setMessages(prev => [
      ...prev,
      { sender: username, message, isFromSystem: false },
    ]);
    socket.emit("message", { sender: username, message, room });
  }
  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={handleJoinRoom}
        >
          <h2>Join Room</h2>
          <Input
            type="text"
            placeholder="Username"
            onChange={ev => setUsername(ev.target.value)}
          />
          <Input
            type="text"
            placeholder="Room"
            onChange={ev => setRoom(ev.target.value)}
          />
          <Button className="bg-blue-600" type="submit">
            Join
          </Button>
        </form>
      ) : (
        <div className="w-full max-w-[500px] border p-3 rounded-md">
          <h2>Room: {room}</h2>
          <div>
            {messages.map((msgObj, idx) => (
              <ChatMessage
                isFromSystem={msgObj.isFromSystem}
                message={msgObj.message}
                sender={msgObj.sender}
                isOwnMessage={username === msgObj.sender}
                key={idx}
              />
            ))}
            <ChatForm onSendMessage={onSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
}
