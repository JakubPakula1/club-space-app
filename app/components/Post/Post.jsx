"use client";
import { useState } from "react";
import styles from "./Post.module.css";

export default function Post({
  username,
  content,
  timestamp,
  likes,
  onLike,
  postId,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes || 0);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setIsLiked((prev) => !prev);
        setLikesCount((prev) =>
          isLiked ? parseInt(prev) - 1 : parseInt(prev) + 1
        );
        if (onLike) onLike(postId);
      }
    } catch (error) {
      console.error("Błąd polubienia:", error);
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.header}>
        <h3 className={styles.username}>{username}</h3>
        <small className={styles.timestamp}>
          {new Date(timestamp).toLocaleString()}
        </small>
      </div>
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        <button
          onClick={handleLike}
          className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
        >
          ❤️ {likesCount}
        </button>
      </div>
    </div>
  );
}
