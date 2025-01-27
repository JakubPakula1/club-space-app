"use client";
import { useState, useEffect } from "react";
import { useGroupRole } from "@/app/hooks/useGroupRole";
import styles from "./Posts.module.css";
import Post from "../Post/Post";

export default function Posts({ groupId }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const { loading, role, error } = useGroupRole(groupId);
  useEffect(() => {
    fetchPosts();
  }, [groupId]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/group/${groupId}/posts`);
      if (!response.ok) {
        throw new Error("Błąd pobierania postów");
      }
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
      const response = await fetch(`/api/group/${groupId}/posts`, {
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
          <Post
            key={post.id}
            postUsername={post.username}
            content={post.content}
            timestamp={post.timestamp}
            likes={post.likes}
            onLike=""
            postId={post.id}
            userRank={role}
          />
        ))}
      </div>
    </div>
  );
}
