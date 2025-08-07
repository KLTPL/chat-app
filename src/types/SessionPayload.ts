import { JWTPayload } from "jose";

export default interface SessionPayload extends JWTPayload {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
  };
}
