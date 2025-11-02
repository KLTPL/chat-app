import Message, { MessageSending } from "@/types/Message";
import { UserSessionData } from "@/types/UserSessionData";
import React from "react";

export type MarginTopRoomMessage =
  | "SAME_USER"
  | "SAME_USER_LONG_TIME"
  | "OTHER_USER"
  | "SENDING_SEPARATOR"
  | "NONE";

type Props = {
  message: Message | MessageSending;
  user: UserSessionData;
  marginTop: MarginTopRoomMessage;
};

function getMarginTopVal(marginTop: MarginTopRoomMessage) {
  const baseRemVal = 0.25;
  switch (marginTop) {
    case "SAME_USER":
      return `${baseRemVal}rem`;
    case "SAME_USER_LONG_TIME":
      return `${baseRemVal * 4}rem`;
    case "OTHER_USER":
      return `${baseRemVal * 2}rem`;
    case "SENDING_SEPARATOR":
      return `${baseRemVal * 4}rem`;
    case "NONE":
      return ``;
  }
}

function RoomMessage({ message, user, marginTop }: Props) {
  const { content, messageType } = message;
  // const {createdAt, id, user} = message;
  const isFromSystem = messageType === "JOINED";
  const isOwnMessage =
    messageType === "SENDING" ||
    (messageType === "MESSAGE" && message.user.id === user.id);
  console.log(message.content);
  return (
    <div
      style={{ marginTop: getMarginTopVal(marginTop) }}
      className={`flex ${
        isFromSystem
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "jusitfy-start"
      }`}
    >
      <div
        className={`py-2 px-3 rounded-lg  ${
          isFromSystem
            ? "bg-gray-800 text-white"
            : isOwnMessage
            ? "bg-blue-600 text-white"
            : "bg-green-300 text-black"
        }`}
      >
        {!isFromSystem && !isOwnMessage && (
          <p className="text-sm font-bold">{user.username}</p>
        )}
        <div>
          <p className="whitespace-break-spaces">{content}</p>
        </div>
      </div>
    </div>
  );
}

export default RoomMessage;
