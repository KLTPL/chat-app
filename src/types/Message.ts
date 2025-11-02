import { MessageType } from "@prisma/client";
import { UserSessionData } from "./UserSessionData";
import Prettify from "./Prettify";

export default interface Message {
  user: UserSessionData;
  id: number;
  content: string;
  createdAt: Date;
  messageType: MessageType;
}

export type MessageSaved = Prettify<
  Pick<Message, "createdAt" | "id"> & { clientId: string }
>;

export type MessageSending = {
  clientId: string;
  content: string;
  sentAt: Date;
  messageType: "SENDING";
};
