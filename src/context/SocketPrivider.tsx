"use client";

import SessionPayload from "@/types/SessionPayload";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import { useState, createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketContextType = {
  socket: SocketType | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionPayload;
}) {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000/", {
      // path: "/socket.io",
    });
    socketInstance.on("connect", () => {
      console.log("CONNECT CLIENT");
      socketInstance.emit("join_rooms");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session]);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
}
