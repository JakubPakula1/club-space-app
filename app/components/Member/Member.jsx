import styles from "./Member.module.css";
export default function Member({ username, description }) {
  return (
    <div className={styles.member}>
      <h3 className={styles.username}>{username}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
