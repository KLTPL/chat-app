import { JWTPayload } from "jose";
import { UserSessionData } from "./UserSessionData";

export default interface SessionPayload extends JWTPayload {
  user: UserSessionData;
}
