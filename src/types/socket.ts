import Message, { MessageSaved } from "@/types/Message";
import { UserSessionData } from "./UserSessionData";
import Prettify from "./Prettify";

export interface ServerToClientEvents {
  message: (
    data: Prettify<Omit<Message, "createdAt"> & { createdAt: number }>
  ) => void;
  messageSaved: (
    data: Prettify<Omit<MessageSaved, "createdAt"> & { createdAt: number }>
  ) => void;
}
export interface ClientToServerEvents {
  message: (data: {
    user: UserSessionData;
    roomId: string;
    content: string;
    clientId: string;
  }) => void;
  join_room: (data: { roomId: string }) => void;
}
