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
    fetchMessages();
    socket.emit("joinRoom", {
      username,
      room: id,
    });

    socket.on("message", (msg) => {
      console.log("Otrzymana wiadomość:", msg);
      saveMessage(msg);
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
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/group/${id}/messages`);
      if (response.ok) {
        const data = await response.json();
        const correctData = data.map((message) => ({
          username: message.username,
          text: message.content,
          timestamp: message.created_at,
        }));
        setMessages(correctData);
      }
    } catch (error) {
      console.error("Błąd pobierania wiadomości:", error);
    }
  };

  const saveMessage = async (messageData) => {
    try {
      await fetch(`/api/group/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageData.text,
          username: messageData.username,
        }),
      });
    } catch (error) {
      console.error("Błąd zapisywania wiadomości:", error);
    }
  };

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
