import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import saveMessage from "@/lib/messages";
import fetchUsersChatIds from "@/lib/prisma/usersChatIds";
import { parse } from "cookie";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { decrypt } from "@/lib/auth";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const getRoomRoomName = (roomId: string) => `room:${roomId}`;
const getUserRoomName = (userId: string) => `user:${userId}`;

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  io.use(async (socket, next) => {
    try {
      console.log("Middleelelel");
      const cookiesHeader = socket.request.headers.cookie;
      if (!cookiesHeader) {
        return next(new Error("No cookies"));
      }

      const cookies = parse(cookiesHeader);
      const sessionCookie = cookies[SESSION_COOKIE_NAME];

      if (!sessionCookie) {
        return next(new Error("No session cookie"));
      }

      const session = await decrypt(sessionCookie);

      if (!session || !session.user) {
        return next(new Error("Invalid session"));
      }

      const now = Math.floor(Date.now() / 1000);
      if (!session.exp || session.exp < now) {
        return next(new Error("Session Expired"));
      }
      socket.data.userId = session.user.id;
      next();
    } catch (error) {
      console.error(error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", socket => {
    const userId = socket.data.userId as string;
    if (userId) {
      console.log(`User connected ${userId}`);
      socket.join(getUserRoomName(userId));
    }

    socket.on("join_rooms", async () => {
      const chatRoomIds = await fetchUsersChatIds(userId);
      socket.join(chatRoomIds.map(getRoomRoomName));
      console.log(`Joined user ${userId} to all of their rooms`, socket.rooms);
    });

    socket.on("message", async ({ roomId, content, user, clientId }) => {
      console.log(
        `Message from ${user.username} in room ${roomId}: ${content}`,
      );
      const resMessage = await saveMessage({
        content,
        messageType: "MESSAGE",
        room: { connect: { id: roomId } },
        user: { connect: { id: user.id } },
      });

      socket.emit("messageSaved", {
        createdAt: resMessage.createdAt.getTime(),
        id: resMessage.id,
        clientId,
      });
      socket.to(getRoomRoomName(roomId)).emit("message", {
        content,
        createdAt: resMessage.createdAt.getTime(),
        id: resMessage.id,
        messageType: "MESSAGE",
        user,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected ${userId}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
