"use client";
import Chat from "@/app/components/Chat/Chat";
import { useState, useEffect } from "react";

export default function Group({ params }) {
  const [id, setId] = useState();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGroup();
  }, []);

  async function getGroup() {
    try {
      const { groupId } = await params;
      setId(groupId);
      const res = await fetch(`/api/group/${groupId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Nie udało się pobrać danych grupy");
      }

      const data = await res.json();
      setGroupData(data);
    } catch (error) {
      console.error("Błąd:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;
  if (!groupData) return <div>Nie znaleziono grupy</div>;

  return (
    <div>
      <h1>{groupData.name}</h1>
      <p>{groupData.description}</p>
      <Chat id={id} />
    </div>
  );
}
