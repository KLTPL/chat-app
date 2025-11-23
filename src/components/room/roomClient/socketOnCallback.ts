import { ServerToClientEvents } from "@/types/socket";
import Message, { MessageSending } from "@/types/Message";
import { Dispatch, RefObject, SetStateAction } from "react";
import { UserSessionData } from "@/types/UserSessionData";

export function createOnMessageCallback(
  messagesContainer: RefObject<HTMLDivElement | null>,
  shouldScrollNextTime: RefObject<boolean>,
  setMessages: Dispatch<SetStateAction<Message[]>>
): ServerToClientEvents["message"] {
  return message => {
    if (messagesContainer.current) {
      const temp =
        messagesContainer.current?.scrollTop +
        messagesContainer.current?.clientHeight -
        messagesContainer.current?.scrollHeight;
      if (temp === 0) {
        shouldScrollNextTime.current = true;
      }
    }

    setMessages(prev => [
      ...prev,
      { ...message, createdAt: new Date(message.createdAt) },
    ]);
  };
}

export function createOnMessageSavedCallback(
  user: UserSessionData,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  messagesSending: MessageSending[],
  setMessagesSending: Dispatch<SetStateAction<MessageSending[]>>
): ServerToClientEvents["messageSaved"] {
  return messageSaved => {
    const messIdx = messagesSending.findIndex(
      messageSending => messageSending.clientId === messageSaved.clientId
    );
    if (messIdx === -1) {
      console.error("Could not find message in messagesSending"); // very nice console.error
      return;
    }
    const { content } = messagesSending[messIdx];

    setMessagesSending(prev => [
      ...prev.slice(0, messIdx),
      ...prev.slice(messIdx + 1, prev.length),
    ]);
    setMessages(prev => [
      ...prev,
      {
        content,
        createdAt: new Date(messageSaved.createdAt),
        id: messageSaved.id,
        user,
        messageType: "MESSAGE",
      },
    ]);
  };
}
