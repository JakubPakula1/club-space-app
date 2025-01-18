import { useState } from "react";
import styles from "./FormInput.module.css";

export default function FormInput({ children, type, initialValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputData, setInputData] = useState(initialValue);

  const handleEdit = (e) => {
    e.preventDefault();
    if (isEditing && onSave) {
      onSave(inputData);
    }
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    setInputData(initialValue);
    setIsEditing(false);
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{children}: </label>
      {isEditing ? (
        <>
          <input
            className={styles.input}
            value={inputData}
            type={type}
            onChange={(e) => setInputData(e.target.value)}
          />
          <button className={styles.button} onClick={handleEdit}>
            {isEditing ? "Save" : "Edit"}
          </button>
          {isEditing && (
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          )}
        </>
      ) : (
        <>
          <p className={styles.value}>{initialValue}</p>
          <button className={styles.button} onClick={handleEdit}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </>
      )}
    </div>
  );
}
