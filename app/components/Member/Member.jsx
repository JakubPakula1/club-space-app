import styles from "./Member.module.css";
export default function Member({ username, description, rank }) {
  return (
    <div className={styles.member}>
      <h3 className={styles.username}>
        {username} <span className={styles.rank}>({rank})</span>
      </h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
