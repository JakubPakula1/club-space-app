import styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>
            Anuluj
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
}
