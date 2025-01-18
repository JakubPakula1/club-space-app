import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import { getSocket } from "@/app/utils/socket";
import Message from "../Message/Message";
import { useAuth } from "../../context/AuthContext";

const Chat = ({ id }) => {
  const socket = getSocket();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { username } = useAuth();

  useEffect(() => {
    socket.emit("joinRoom", {
      username,
      room: id,
    });

    socket.on("message", (msg) => {
      console.log("Otrzymana wiadomość:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
      socket.emit("leaveRoom", { room: id });
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const messageData = {
        room: id,
        message: message.trim(),
      };
      console.log("Wysyłanie wiadomości:", messageData);
      socket.emit("chatMessage", messageData);
      setMessage("");
    }
  };
  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} ref={messagesEndRef}>
            <Message
              text={msg.text}
              username={msg.username}
              timestamp={msg.timestamp}
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Wyślij
        </button>
      </form>
    </div>
  );
};

export default Chat;
