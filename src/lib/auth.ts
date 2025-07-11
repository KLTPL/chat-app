import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const sessionCookieName = "session";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(key);
}

export async function decrypt(session: string) {
  const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
  return payload;
}

export async function login(fromData: FormData) {
  const user = {
    email: fromData.get("email"),
    name: "kltpl",
    password: fromData.get("password"),
  };

  const expires = Date.now() + 10000;
  const session = await encrypt({ user, exp: expires });

  (await cookies()).set(sessionCookieName, session, {
    expires,
    httpOnly: true,
  });
}

export async function logout() {
  (await cookies()).set(sessionCookieName, "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get(sessionCookieName)?.value;
  if (session === undefined) {
    return null;
  }
  return await decrypt(session);
}
