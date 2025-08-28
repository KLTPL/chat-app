import Prettify from "./Prettify";
import { UserSessionData } from "./UserSessionData";

export default interface Message {
  user: Prettify<Pick<UserSessionData, "id" | "name" | "username">>;
  message: string;
  isFromSystem: boolean;
}
