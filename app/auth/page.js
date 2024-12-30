"use client";
import { useState } from "react";
import styles from "../styles/Auth.module.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleBtn} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Log in
          </button>
          <button
            className={`${styles.toggleBtn} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "Log in" : "Register"}
          </button>
        </form>

        <p className={styles.switchMode}>
          {isLogin
            ? "You don't have an account?"
            : "You already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register now!" : "Log in!"}
          </span>
        </p>
      </div>
    </div>
  );
}
