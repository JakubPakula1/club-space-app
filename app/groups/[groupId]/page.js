"use client";
import Chat from "@/app/components/Chat/Chat";
import { useState, useEffect } from "react";
import styles from "@/app/styles/Group.module.css";
import { useRouter } from "next/navigation";
import Member from "@/app/components/Member/Member";

export default function Group({ params }) {
  const [id, setId] = useState();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const router = useRouter();

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
  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${id}/leave`, {
        method: "POST",
      });
      if (response.ok) {
        router.push("/groups");
      }
    } catch (error) {
      console.error("Błąd opuszczania grupy:", error);
    }
  };
  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;
  if (!groupData) return <div>Nie znaleziono grupy</div>;

  return (
    <>
      <h1 className={styles.name}>{groupData.name}</h1>
      <p className={styles.description}>{groupData.description}</p>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.switchButtons}>
            <button
              className={`${styles.switchButton} ${
                showChat ? styles.switchButtonActive : ""
              }`}
              onClick={() => setShowChat(true)}
            >
              Chat
            </button>
            <button
              className={`${styles.switchButton} ${
                !showChat ? styles.switchButtonActive : ""
              }`}
              onClick={() => setShowChat(false)}
            >
              Posts
            </button>
          </div>
          <h1 className={styles.name}>{groupData.name}</h1>
          <p className={styles.description}>{groupData.description}</p>
          <button className={styles.leaveButton} onClick={handleLeaveGroup}>
            Opuść grupę
          </button>
        </div>
        {showChat ? <Chat id={id} /> : <Posts groupId={id} />}
        <div className={styles.right}>
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
          <Member username="Test" description="22342424234" />
        </div>
      </div>
    </>
  );
}
