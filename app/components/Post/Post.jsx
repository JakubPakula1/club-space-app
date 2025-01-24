"use client";
import { useState, useEffect } from "react";
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [showComments]);
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
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Błąd pobierania komentarzy:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Błąd dodawania komentarza:", error);
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
        <button
          onClick={() => setShowComments(!showComments)}
          className={styles.commentButton}
        >
          💬 {comments.length}
        </button>
      </div>

      {showComments && (
        <div className={styles.comments}>
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Dodaj komentarz..."
              required
              className={styles.commentInput}
            />
            <button type="submit" className={styles.submitButton}>
              Wyślij
            </button>
          </form>

          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <strong>{comment.username}</strong>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
