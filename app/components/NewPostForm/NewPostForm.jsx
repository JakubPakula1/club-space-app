"use client";
import { useState } from "react";
import styles from "./NewPostForm.module.css";

export default function NewPostForm({ groupId, onPostCreated }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent("");
        if (onPostCreated) onPostCreated();
      }
    } catch (error) {
      console.error("Błąd dodawania posta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="O czym myślisz?"
        className={styles.input}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? "Publikowanie..." : "Opublikuj"}
      </button>
    </form>
  );
}
