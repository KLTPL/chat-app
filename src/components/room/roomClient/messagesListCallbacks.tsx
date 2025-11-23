import { UserSessionData } from "@/types/UserSessionData";
import Message, { MessageSending } from "@/types/Message";
import RoomMessage, { MarginTopRoomMessage } from "./RoomMessage";
import DateMessage from "./DateMessage";
import React from "react";

export function createCallbackForMessagesMapForRoomMessageComponent(
  user: UserSessionData
) {
  return function mapFun(msgObj: Message, idx: number, messages: Message[]) {
    let margin: MarginTopRoomMessage = "NONE";
    const showDate =
      idx === 0 ||
      msgObj.createdAt.toDateString() !==
        messages[idx - 1].createdAt.toDateString() ||
      msgObj.createdAt.getTime() - messages[idx - 1].createdAt.getTime() >
        1000 * 60 * 60 * 2;

    if (!showDate && idx > 0) {
      const previous = messages[idx - 1];
      const diff = msgObj.createdAt.getTime() - previous.createdAt.getTime();
      if (previous.user.id === msgObj.user.id) {
        if (diff > 1000 * 10) {
          margin = "SAME_USER_LONG_TIME";
        } else {
          margin = "SAME_USER";
        }
      } else {
        margin = "OTHER_USER";
      }
    }

    return (
      <React.Fragment key={`message-${idx}-fragment`}>
        {showDate && <DateMessage date={msgObj.createdAt} />}
        <RoomMessage message={msgObj} user={user} marginTop={margin} />
      </React.Fragment>
    );
  };
}

export function createCallbackForMessagesSendingMapForRoomMessageComponent(
  user: UserSessionData
) {
  return function mapFun(
    msgObj: MessageSending,
    idx: number,
    messages: MessageSending[]
  ) {
    let margin: MarginTopRoomMessage = "SENDING_SEPARATOR";
    if (idx > 0) {
      const previous = messages[idx - 1];
      const diff = msgObj.sentAt.getTime() - previous.sentAt.getTime();
      if (diff > 1000 * 10) {
        margin = "SAME_USER_LONG_TIME";
      } else {
        margin = "SAME_USER";
      }
    }
    const key = `messageSending-${idx}`;
    return (
      <RoomMessage message={msgObj} user={user} key={key} marginTop={margin} />
    );
  };
}
