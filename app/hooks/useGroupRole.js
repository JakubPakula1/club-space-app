import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export function useGroupRole(groupId) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
      if (!groupId || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/group/${groupId}/role?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Błąd pobierania roli");
        }
        const data = await response.json();
        setRole(data.rank);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [groupId, userId]);

  return { role, loading, error };
}
