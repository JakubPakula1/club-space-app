"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/users/auth");
      const data = await response.json();
      setIsAuthenticated(response.ok);
      if (response.ok) {
        setUserId(data.user.id);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
