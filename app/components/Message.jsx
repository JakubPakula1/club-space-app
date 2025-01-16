import styles from "@/app/styles/Message.module.css";
export default function Message({ text, username, timestamp, type = "chat" }) {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      {type === "chat" && (
        <strong className={styles.username}>{username}</strong>
      )}
      <p className={styles.text}>{text}</p>
      <small className={styles.timestamp}>
        {new Date(timestamp).toLocaleString()}
      </small>
    </div>
  );
}
