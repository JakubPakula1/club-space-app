"use client";
import { useState, useEffect } from "react";
import styles from "@/app/styles/Account.module.css";
import FormInput from "../components/FormInput/FormInput";

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/auth");
      const data = await response.json();
      if (response.ok) {
        const dbResponse = await fetch(`/api/users/${data.user.id}`);
        const dbData = await dbResponse.json();

        setUserData(dbData);
      }
    } catch (error) {
      console.error("Błąd:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async (newValue, field) => {
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (response.ok) {
        setUserData((prev) => ({ ...prev, [field]: newValue }));
        fetchUserData();
      }
    } catch (error) {
      console.error(`Błąd aktualizacji ${field}:`, error);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!userData) return <div>Brak danych użytkownika</div>;
  console.log(userData);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Account</h1>
      <div className={styles.content}>
        <form className={styles.form}>
          <FormInput
            type="text"
            initialValue={userData.name}
            onSave={(value) => handleSave(value, "name")}
          >
            Username
          </FormInput>
          <FormInput
            type="text"
            initialValue={userData.description || ""}
            onSave={(value) => handleSave(value, "description")}
          >
            Description
          </FormInput>
          <FormInput
            type="password"
            onSave={(value) => handleSave(value, "password")}
          >
            Password
          </FormInput>
        </form>
      </div>
    </div>
  );
}
