import { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/Chat.module.css";
import { getSocket } from "@/app/utils/socket";

const Chat = ({ id }) => {
  const socket = getSocket();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
      if (isJoined) {
        socket.emit("leaveRoom", { room: id });
      }
    };
  }, [id, isJoined]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("chatMessage", {
        room: id,
        message: message.trim(),
      });
      setMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.message} ref={messagesEndRef}>
            <span className={styles.text}>{msg.text}</span>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
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
