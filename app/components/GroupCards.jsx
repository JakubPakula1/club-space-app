"use client";
import { useRouter } from "next/navigation";
import groupcard from "@/app/styles/GroupCard.module.css";

export default function GroupCards({ groups }) {
  const router = useRouter();

  function handleJoin(groupId) {
    router.push(`/groups/${groupId}`);
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
