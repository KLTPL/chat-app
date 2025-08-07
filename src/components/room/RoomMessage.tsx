import Message from "@/types/Message";
import React from "react";

type Props = Message & {
  isOwnMessage: boolean;
};

function RoomMessage({ isOwnMessage, message, sender, isFromSystem }: Props) {
  return (
    <div
      className={`flex ${
        isFromSystem
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "jusitfy-start"
      }`}
    >
      <div
        className={`py-2 px-3 rounded-lg ${
          isFromSystem
            ? "bg-gray-800 text-white"
            : isOwnMessage
            ? "bg-blue-600 text-white"
            : "bg-green-300 text-black"
        }`}
      >
        {!isFromSystem && !isOwnMessage && (
          <p className="text-sm font-bold">{sender}</p>
        )}
        <p>{message}</p>
      </div>
    </div>
  );
}

export default RoomMessage;
