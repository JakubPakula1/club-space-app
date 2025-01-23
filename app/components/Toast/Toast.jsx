"use client";
import { useState, useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, groupName, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {groupName && <span className={styles.groupName}>{groupName}</span>}
      <div className={styles.message}>{message}</div>
    </div>
  );
}
