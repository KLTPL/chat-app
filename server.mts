import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import Message from "@/types/Message";
// import { saveMessage } from "@/lib/messages";
import { UserSessionData } from "@/types/UserSessionData";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000");

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", socket => {
    console.log(`User connected ${socket.id}`);

    socket.on("join-room", ({ room, user }) => {
      socket.join(room);
      console.log(`User ${user} joined room ${room}`);

      socket.to(room).emit("user_joined", `${user.username} joined room`);
    });

    socket.on(
      "message",
      ({
        room,
        message,
        user,
      }: {
        room: string;
        message: string;
        user: UserSessionData;
      }) => {
        console.log(
          `Messege from ${user.username} in room ${room}: ${message}`
        );
        // saveMessage({messageType: ""});
        socket
          .to(room)
          .emit("message", { user, message, isFromSystem: false } as Message);
      }
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
