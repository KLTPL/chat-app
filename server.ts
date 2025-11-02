import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import saveMessage from "@/lib/messages";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  io.on("connection", socket => {
    console.log(`User connected ${socket.id}`);

    socket.on("join_room", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("message", async ({ roomId, content, user, clientId }) => {
      console.log(
        `Message from ${user.username} in room ${roomId}: ${content}`
      );
      const resMessage = await saveMessage({
        content,
        messageType: "MESSAGE",
        room: { connect: { id: roomId } },
        user: { connect: { id: user.id } },
      });
      await new Promise<void>(resolve => {
        setTimeout(resolve, 2000);
      });
      socket.emit("messageSaved", {
        createdAt: resMessage.createdAt.getTime(),
        id: resMessage.id,
        clientId,
      });
      socket.to(roomId).emit("message", {
        content,
        createdAt: resMessage.createdAt.getTime(),
        id: resMessage.id,
        messageType: "MESSAGE",
        user,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
