"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./Posts.module.css";

export default function Posts({ groupId }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const { username } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [groupId]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Błąd pobierania postów:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await fetch(`/api/groups/${groupId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        setNewPost("");
        fetchPosts();
      }
    } catch (error) {
      console.error("Błąd dodawania posta:", error);
    }
  };

  return (
    <div className={styles.postsContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="O czym myślisz?"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Opublikuj
        </button>
      </form>

      <div className={styles.posts}>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <strong>{post.username}</strong>
              <small>{new Date(post.created_at).toLocaleString()}</small>
            </div>
            <p className={styles.content}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
