import { UserSessionData } from "@/types/UserSessionData";
import Message, { MessageSending } from "@/types/Message";
import RoomMessage, { MarginTopRoomMessage } from "./RoomMessage";

export function createCallbackForMessagesMapForRoomMessageComponent(
  user: UserSessionData
) {
  return function mapFun(msgObj: Message, idx: number, messages: Message[]) {
    let margin: MarginTopRoomMessage = "NONE";
    if (idx !== 0) {
      const previous = messages[idx - 1];
      if (previous.user.id === msgObj.user.id) {
        const diff = msgObj.createdAt.getTime() - previous.createdAt.getTime();
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
      <RoomMessage message={msgObj} user={user} key={idx} marginTop={margin} />
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
    if (idx !== 0) {
      const previous = messages[idx - 1];
      const diff = msgObj.sentAt.getTime() - previous.sentAt.getTime();
      if (diff > 1000 * 10) {
        margin = "SAME_USER_LONG_TIME";
      } else {
        margin = "SAME_USER";
      }
    }
    return (
      <RoomMessage message={msgObj} user={user} key={idx} marginTop={margin} />
    );
  };
}
