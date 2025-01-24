"use client";
import { useState, useEffect } from "react";
import styles from "@/app/styles/Account.module.css";
import FormInput from "../components/FormInput/FormInput";
import Modal from "@/app/components/Modal/Modal";
import { useRouter } from "next/navigation";

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/auth");
      }
    } catch (error) {
      console.error("Błąd usuwania konta:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

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
        method: "PATCH",
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
      <div className={styles.deleteSection}>
        <button
          className={styles.deleteButton}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete account
        </button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account"
        message="Are you sure you want to delete your account? This operation cannot be undone."
      />
    </div>
  );
}
