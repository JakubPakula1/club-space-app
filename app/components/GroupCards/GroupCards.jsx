"use client";
import { useRouter } from "next/navigation";
import groupcard from "./GroupCard.module.css";

export default function GroupCards({ groups }) {
  const router = useRouter();

  async function handleJoin(groupId) {
    try {
      const response = await fetch(`/api/group/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push(`/groups/${groupId}`);
      }
    } catch (error) {
      console.error("Błąd dołączania do grupy:", error);
    }
  }
  return (
    <div className={groupcard.container}>
      {groups.map((group) => (
        <div key={group.id} className={groupcard.card}>
          <div className={groupcard.info}>
            <h1 className={groupcard.name}>{group.name}</h1>
            <button
              className={groupcard.button}
              onClick={() => handleJoin(group.id)}
            >
              Join
            </button>
          </div>
          <p className={groupcard.description}>{group.description}</p>
        </div>
      ))}
    </div>
  );
}
