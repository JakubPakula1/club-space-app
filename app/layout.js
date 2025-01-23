"use client";
import { useState, useEffect } from "react";
import { getMQTTClient } from "@/lib/mqtt";
import Toast from "@/app/components/Toast/Toast";
import { Geist, Geist_Mono, Inter, Orbitron } from "next/font/google";
import "./styles/globals.css";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const mqttClient = getMQTTClient();

    mqttClient.on("message", (topic, message) => {
      console.log("test");
      const data = JSON.parse(message.toString());
      if (data.type === "new_post") {
        setNotification({
          message: `${data.username} dodał nowy post: ${data.content.substring(
            0,
            30
          )}...`,
          type: "info",
          groupName: data.groupName,
        });
      }
    });
  }, []);
  return (
    <html lang="en" className={orbitron.variable}>
      <body>
        <AuthProvider>
          <Navigation />
          {children}
          {notification && (
            <Toast
              message={notification.message}
              type={notification.type}
              groupName={notification.groupName}
              onClose={() => setNotification(null)}
            />
          )}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
