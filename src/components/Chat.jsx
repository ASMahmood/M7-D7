import React, { useState, useEffect } from "react";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";
import io from "socket.io-client";

const connOpt = {
  transports: ["websocket"],
};

let socket = io("https://striveschool-api.herokuapp.com", connOpt);

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => console.log("connected to socket"));
    socket.on("list", (list) => console.log(list));
    socket.on("bmsg", (msg) => setMessages((messages) => messages.concat(msg)));
  }, []);
  return (
    <div id="chatBox">
      <ul></ul>
    </div>
  );
}
