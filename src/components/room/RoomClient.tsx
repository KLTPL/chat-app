"use client";

import RoomForm from "@/components/room/roomClient/RoomForm";
import { useCallback, useEffect, useRef, useState } from "react";
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
import LoadingArrow from "../ui/LoadSpinner";

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
  const [isFetchingNewMessages, setIsFetchingNewMessages] =
    useState<boolean>(false);
  const bottomMessages = useRef<null | HTMLDivElement>(null);
  const messagesContainer = useRef<null | HTMLDivElement>(null);
  const shouldScrollNextTime = useRef<boolean>(false);
  const prevMessagesSendingLength = usePrevious(messagesSending.length); // used to check if new message was added or removed in useEffect
  const messagesFetched = useRef(0);
  const isFetchMoreMessagesMax = useRef(false);
  const isInitLoadDone = useRef(false);
  const subtractHeight = useRef<number>(0); // if new messages loaded go down on next render

  const fetchMoreMessages = useCallback(async () => {
    const FETCH_AMOUNT = 30;
    setIsFetchingNewMessages(true);

    const newMessages = await fetchMessagesFromRoom(
      roomId,
      FETCH_AMOUNT,
      messagesFetched.current
    );
    if (newMessages.length < FETCH_AMOUNT) {
      isFetchMoreMessagesMax.current = true;
    }
    setMessages(prev => [...newMessages, ...prev]);
    messagesFetched.current += newMessages.length;
    if (messagesContainer.current) {
      subtractHeight.current = messagesContainer.current.scrollHeight;
    }

    setIsFetchingNewMessages(false);
  }, [roomId]);

  const handleScroll = useCallback(async () => {
    if (
      messagesContainer.current &&
      messagesContainer.current?.scrollTop === 0 &&
      !isFetchingNewMessages &&
      !isFetchMoreMessagesMax.current
    ) {
      await fetchMoreMessages();
    }
  }, [
    messagesContainer,
    isFetchingNewMessages,
    fetchMoreMessages,
    isFetchMoreMessagesMax,
  ]);

  useEffect(() => {
    socket.emit("join_room", { roomId });
  }, [roomId]);

  useEffect(() => {
    const container = messagesContainer.current;
    if (isInitLoadDone.current) {
      container?.addEventListener("scroll", handleScroll);
    }

    if (!isInitLoadDone.current) {
      handleScroll().then(() => {
        shouldScrollNextTime.current = true;
      });
      isInitLoadDone.current = true;
    }
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [roomId, handleScroll]);

  useEffect(() => {
    if (shouldScrollNextTime.current) {
      bottomMessages.current?.scrollIntoView({ behavior: "instant" });
      shouldScrollNextTime.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    if (prevMessagesSendingLength === null) {
      return;
    } // first render
    if (messagesSending.length > prevMessagesSendingLength) {
      bottomMessages.current?.scrollIntoView({ behavior: "instant" });
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

  useEffect(() => {
    const con = messagesContainer.current;
    if (con && subtractHeight.current !== 0) {
      con.scrollTop = con.scrollHeight - subtractHeight.current;
      subtractHeight.current = 0;
    }
  });

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
        className="flex flex-col mx-3 overflow-y-auto relative h-full"
        ref={messagesContainer}
      >
        {isFetchingNewMessages && (
          <div className="w-full absolute top-0 flex justify-center z-10">
            <div className="bg-[#FFFFFF57]">
              <LoadingArrow />
            </div>
          </div>
        )}
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
        <div ref={bottomMessages}></div>
      </div>
      <RoomForm onSendMessage={onSendMessage} />
    </div>
  );
}
