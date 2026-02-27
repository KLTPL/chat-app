import { jwtVerify, SignJWT } from "jose";
import SessionPayload from "@/types/SessionPayload";

const KEY = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_TIME_S = 60 * 60 * 10;

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TIME_S)
    .sign(KEY);
}

export async function decrypt(session: string) {
  const { payload } = await jwtVerify(session, KEY, { algorithms: ["HS256"] });
  return payload as SessionPayload;
}
