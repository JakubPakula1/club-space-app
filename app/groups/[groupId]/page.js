"use client";
import Chat from "@/app/components/Chat/Chat";
import { useState, useEffect } from "react";
import styles from "@/app/styles/Group.module.css";
import { useRouter } from "next/navigation";
import Member from "@/app/components/Member/Member";
import Posts from "@/app/components/Posts/Posts";
import { getMQTTClient } from "@/lib/mqtt";
import { useGroupRole } from "@/app/hooks/useGroupRole";
import Modal from "@/app/components/Modal/Modal";

export default function Group({ params }) {
  const [id, setId] = useState();
  const [groupData, setGroupData] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const { role } = useGroupRole(id);
  const router = useRouter();
  const mqttClient = getMQTTClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

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
      setGroupData(data.group);
      setGroupMembers(data.members);
    } catch (error) {
      console.error("Błąd:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`/api/group/${id}/leave`, {
        method: "POST",
      });
      if (response.ok) {
        router.push("/groups");
        mqttClient.unsubscribe(`group/${id}/posts`);
      }
    } catch (error) {
      console.error("Błąd opuszczania grupy:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/group/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/groups");
      }
    } catch (error) {
      console.error("Błąd usuwania grupy:", error);
    } finally {
      setIsDeleteModalOpen(false);
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
          {role === "owner" ? (
            <button className={styles.leaveButton} onClick={handleDeleteClick}>
              Delete group
            </button>
          ) : (
            <button className={styles.leaveButton} onClick={handleLeaveGroup}>
              Leave
            </button>
          )}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete group"
            message="Are you sure you want to delete this group? This operation cannot be undone."
          />
        </div>
        {showChat ? <Chat id={id} /> : <Posts groupId={id} />}
        <div className={styles.right}>
          {groupMembers.map((member) => (
            <Member
              key={member.id}
              username={member.name}
              description={member.description || "Hi! "}
              rank={member.rank}
            />
          ))}
        </div>
      </div>
    </>
  );
}
