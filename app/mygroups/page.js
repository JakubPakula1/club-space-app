"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import GroupCards from "../components/GroupCards/GroupCards";

export default function Mygroups() {
  const [userGroups, setUserGroups] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  async function getUsersGroups() {
    try {
      const res = await fetch("/api/users/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log();
        setUserGroups(data);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage("Error fetching group");
      console.error(error);
    }
  }
  useEffect(() => {
    getUsersGroups();
  }, []);
  console.log(userGroups);
  return (
    <div>
      {isLoading ? (
        <div>Pobieranie danych</div>
      ) : (
        <GroupCards groups={userGroups} />
      )}
    </div>
  );
}
