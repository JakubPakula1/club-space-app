"use client";
import GroupCards from "../components/GroupCards/GroupCards";
import { useState, useEffect } from "react";
import styles from "@/app/styles/Groups.module.css";
import { useAuth } from "../context/AuthContext";

export default function Groups() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [option, setOption] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, userId }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Group ${data.name} created successfully!`);
        setName("");
        setDescription("");
        getGroups();
      } else {
        setMessage(`Error ${data.error}`);
      }
    } catch (error) {
      setMessage("Error creating group");
      console.error(error);
    }
  }

  async function getGroups() {
    try {
      const url = searchTerm
        ? `/api/groups?search=${encodeURIComponent(searchTerm)}`
        : "/api/groups";

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        setGroups(data);
      }
    } catch (error) {
      setMessage("Error fetching groups");
      console.error(error);
    }
  }

  useEffect(() => {
    getGroups();
  }, [searchTerm]);

  return (
    <>
      {option && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Szukaj grup..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${option ? styles.buttonActive : ""}`}
          onClick={() => setOption(true)}
        >
          Join a group
        </button>
        <button
          className={`${styles.button} ${option ? "" : styles.buttonActive}`}
          onClick={() => setOption(false)}
        >
          Create a group
        </button>
      </div>
      <div>
        {option ? (
          <GroupCards groups={groups} />
        ) : (
          <div className={styles.formContainer}>
            <h1>Create a Group</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Group Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                Create Group
              </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
          </div>
        )}
      </div>
    </>
  );
}
