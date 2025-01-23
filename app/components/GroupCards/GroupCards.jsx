"use client";
import { useRouter } from "next/navigation";
import groupcard from "./GroupCard.module.css";
import { getMQTTClient } from "@/lib/mqtt";

export default function GroupCards({ groups }) {
  const router = useRouter();
  const mqttClient = getMQTTClient();

  async function handleJoin(groupId) {
    try {
      const response = await fetch(`/api/group/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push(`/groups/${groupId}`);
        mqttClient.subscribe(`group/${groupId}/posts`, (err) => {
          if (!err) {
            console.log("zasubskrybowano");
          } else {
            consloe.log(err);
          }
        });
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
