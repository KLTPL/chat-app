"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma/prisma";
import bcrypt from "bcryptjs";
import SessionPayload from "@/types/SessionPayload";

const SESSION_COOKIE_NAME = "session";
const KEY = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_TIME_S = 60 * 60 * 10;

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TIME_S)
    .sign(KEY);
}

export async function createSessionCookie(user: SessionPayload["user"]) {
  const session = await encrypt({
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TIME_S,
  });

  (await cookies()).set(SESSION_COOKIE_NAME, session, {
    maxAge: SESSION_TIME_S,
    httpOnly: true,
  });
}

export async function decrypt(session: string) {
  const { payload } = await jwtVerify(session, KEY, { algorithms: ["HS256"] });
  return payload as SessionPayload;
}

export async function login(
  _prevSatete: { error?: string; success?: boolean },
  formData: FormData
) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    return { error: "Invalid email or password" };
  }

  await createSessionCookie({
    id: user.id,
    username: user.username,
    name: user.name,
  });
  return { success: true };
}

export async function logout() {
  (await cookies()).set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (session === undefined) {
    return null;
  }
  return await decrypt(session);
}

export async function updateSession(session: SessionPayload) {
  session.exp = Math.floor(Date.now() / 1000) + SESSION_TIME_S;

  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt(session),
    httpOnly: true,
    maxAge: SESSION_TIME_S,
  });
  return res;
}

export async function register(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
) {
  const email = formData.get("email")?.toString();
  const username = formData.get("username")?.toString();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !username || !name || !password) {
    return { error: "All fields are required." };
  }

  const existingUserEmail = await prisma.user.findUnique({ where: { email } });
  if (existingUserEmail) {
    return { error: "User with this email already exists." };
  }

  const existingUserUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUserUsername) {
    return { error: "User with this username already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const userCreated = await prisma.user.create({
    data: {
      email,
      username,
      name,
      passwordHash: hashedPassword,
    },
  });

  await createSessionCookie({
    id: userCreated.id,
    username,
    name,
  });

  return { success: true };
}
