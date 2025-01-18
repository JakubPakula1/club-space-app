"use client";
import Header from "./components/Header/Header";
import homepage from "@/app/styles/HomePage.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/users/auth");
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Błąd autoryzacji:", error);
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);
  return (
    <div className={homepage.container}>
      <Header />
      {isAuthenticated ? (
        <>
          <Link href="/groups">
            <button className={homepage.button}>Join a group!</button>
          </Link>
          <Link href="/account">
            <button className={homepage.button}>Manage your account!</button>
          </Link>
        </>
      ) : (
        <Link href="/auth">
          <button className={homepage.button}>LOG IN!/SIGN IN!</button>
        </Link>
      )}
    </div>
  );
}
