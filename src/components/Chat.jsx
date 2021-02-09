import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import io from "socket.io-client";
import "../styles/chatpage.css";

const connOpt = {
  transports: ["websocket"],
};

let socket = io("https://striveschool-api.herokuapp.com", connOpt);

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [username, setUsername] = useState("abdul1");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const getPast = async () => {
    let response = await fetch(
      "https://striveschool-api.herokuapp.com/api/messages/" + username
    );
    let resp = await response.json();
    console.log(resp);
    setAllMessages((allMessages) => allMessages.concat(resp));
  };

  useEffect(() => {
    socket.on("connect", () => console.log("connected to socket"));
    getPast();
    socket.on("list", (list) => setUsers(list));
    socket.emit("setUsername", { username: username });
    socket.on("chatmessage", (text) =>
      setMessages((messages) => messages.concat(text))
    );
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    socket.emit("chatmessage", {
      text: message,
      to: recipient,
    });
    setMessage("");
  };
  return (
    <Container id="chat-page">
      <Row>
        <Col xs={5} id="usersCol">
          <ul>
            {users.length > 0 &&
              users.map((user, index) => (
                <li key={index} onClick={() => setRecipient(user)}>
                  <strong>{user}</strong>
                </li>
              ))}
          </ul>
        </Col>
        <Col xs={7} id="chatCol">
          <h6>CHATTING TO {recipient}</h6>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>
                {console.log(message)}
                <strong>
                  {message.from} to {message.to}
                </strong>{" "}
                {message.text}
              </li>
            ))}
          </ul>
          <form id="chat" onSubmit={sendMessage}>
            <input
              autoComplete="off"
              value={message}
              placeholder="Message"
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
            <Button type="submit" className="rounded-0">
              Send
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}
