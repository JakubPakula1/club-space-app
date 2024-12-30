"use client";
import GroupCards from "../components/GroupCards";
import { useState, useEffect } from "react";

export default function Groups() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
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
      const res = await fetch("/api/groups", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        setGroups(data);
      }
    } catch (error) {
      setMessage("Error fetching group");
      console.error(error);
    }
  }

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <>
      <div>
        <h1>Create a Group</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Group Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Create Group</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <GroupCards groups={groups} />
    </>
  );
}
