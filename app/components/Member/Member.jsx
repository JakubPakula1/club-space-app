import styles from "./Member.module.css";
import { useState, useEffect } from "react";

export default function Member({
  username,
  description,
  rank,
  socket,
  roomId,
}) {
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    if (!socket) return;

    socket.on("activeUsers", ({ users }) => {
      console.log("test");
      setIsOnline(users.includes(username));
    });

    return () => {
      socket.off("activeUsers");
    };
  }, [socket, username]);
  return (
    <div className={styles.member}>
      <div className={styles.header}>
        <span className={styles.username}>{username}</span>
        <span className={`${styles.status} ${isOnline ? styles.online : ""}`}>
          <span className={styles.statusText}>
            {isOnline ? "online" : "offline"}
          </span>
        </span>
      </div>
      <p className={styles.description}>{description}</p>
      <span className={styles.rank}>{rank}</span>
    </div>
  );
}
