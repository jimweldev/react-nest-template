import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Socket, io } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SOCKET_BASE_URL);

const PrivateLayout = () => {
  useEffect(() => {
    socket.emit("login", "1");

    // Define event listeners
    socket.on("getOnlineUsers", (data) => {
      console.log("Online users: ", data);
    });

    socket.on("receiveMessage", (data) => {
      console.log("message: ", data);
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <>
      <button
        onClick={() =>
          socket.emit("sendMessage", { userId: "1", message: "hello" })
        }
      >
        send message
      </button>
      <Outlet />
    </>
  );
};

export default PrivateLayout;
