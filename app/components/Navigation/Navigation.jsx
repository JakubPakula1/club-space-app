"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import navigation from "./Navigation.module.css";
import { useAuth } from "@/app/context/AuthContext";

export default function Navigation() {
  const { isAuthenticated, checkAuth } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);
  const handleLogout = async () => {
    const response = await fetch("/api/users/logout", {
      method: "POST",
    });
    if (response.ok) {
      await checkAuth();
      router.push("/");
    }
  };
  return (
    <nav className={navigation.nav}>
      <div className={navigation.leftSection}>
        <Link href="/">Home</Link>
        <div className={navigation.bar}></div>
        <Link href="/groups">All groups</Link>
      </div>

      <div className={navigation.centerSection}>
        <Link href="/" className={navigation.title}>
          CLUBSPACE
        </Link>
      </div>

      <div className={navigation.rightSection}>
        <Link href="#">Your Groups</Link>
        <div className={navigation.bar}></div>
        <div className={navigation.accountMenu}>
          <button
            className={navigation.accountBtn}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Account
          </button>
          {showDropdown && (
            <div className={navigation.dropdown}>
              {isAuthenticated ? (
                <>
                  <Link href="/account" onClick={() => setShowDropdown(false)}>
                    Manage
                  </Link>
                  <button onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setShowDropdown(false)}
                  className={navigation.loginBtn}
                >
                  Log in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
