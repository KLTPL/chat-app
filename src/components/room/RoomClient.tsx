"use client";

import RoomForm from "@/components/room/roomClient/RoomForm";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socketClient";
import Message, { MessageSending } from "@/types/Message";
import { UserSessionData } from "@/types/UserSessionData";
import { fetchMessagesFromRoom } from "@/server-actions/messagesFromRoom";
import { v4 as uuid } from "uuid";
import {
  createCallbackForMessagesMapForRoomMessageComponent,
  createCallbackForMessagesSendingMapForRoomMessageComponent,
} from "./roomClient/messagesListCallbacks";
import {
  createOnMessageCallback,
  createOnMessageSavedCallback,
} from "./roomClient/socketOnCallback";

function usePrevious(value: number) {
  const ref = useRef<number | null>(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function RoomClient({
  roomId,
  user,
  roomName,
}: {
  roomId: string;
  roomName: string;
  user: UserSessionData;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesSending, setMessagesSending] = useState<MessageSending[]>([]);
  const bottomMessages = useRef<null | HTMLDivElement>(null);
  const messagesContainer = useRef<null | HTMLDivElement>(null);
  const shouldScrollNextTime = useRef<boolean>(false);
  const prevMessagesSendingLength = usePrevious(messagesSending.length); // used to check if new message was added or removed in useEffect

  useEffect(() => {
    socket.emit("join_room", { roomId });
    (async () => {
      const messages = await fetchMessagesFromRoom(roomId);
      setMessages(messages);
    })();
  }, [roomId]);
  useEffect(() => {
    if (shouldScrollNextTime.current) {
      bottomMessages.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollNextTime.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    if (prevMessagesSendingLength === null) {
      return;
    } // first render
    if (messagesSending.length > prevMessagesSendingLength) {
      bottomMessages.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesSending.length, prevMessagesSendingLength]);

  useEffect(() => {
    socket.on(
      "message",
      createOnMessageCallback(
        messagesContainer,
        shouldScrollNextTime,
        setMessages
      )
    );
    socket.on(
      "messageSaved",
      createOnMessageSavedCallback(
        user,
        setMessages,
        messagesSending,
        setMessagesSending
      )
    );

    return () => {
      socket.off("message");
      socket.off("messageSaved");
    };
  }, [setMessages, messagesSending, user]);
  function onSendMessage(content: string) {
    const messageSending: MessageSending = {
      clientId: uuid(),
      content,
      messageType: "SENDING",
      sentAt: new Date(),
    };
    setMessagesSending(prev => [...prev, messageSending]);
    socket.emit("message", {
      user,
      content,
      roomId,
      clientId: messageSending.clientId,
    });
  }

  return (
    <div className="flex flex-col justify-center w-full pb-3 h-screen">
      <h2 className="text-2xl">Room: {roomName}</h2>
      <div
        className="flex flex-col px-3 overflow-y-auto relative"
        ref={messagesContainer}
      >
        {messages.map(
          createCallbackForMessagesMapForRoomMessageComponent(user)
        )}
        {messagesSending.map(
          createCallbackForMessagesSendingMapForRoomMessageComponent(user)
        )}
        <div className="flex justify-end text-sm text-muted-foreground">
          {messagesSending.length > 0 ? (
            <div>Sent</div>
          ) : (
            messages.at(-1)?.user.id === user.id && <div>Received</div>
          )}
        </div>
        <RoomForm onSendMessage={onSendMessage} />
        <div ref={bottomMessages}></div>
      </div>
    </div>
  );
}
