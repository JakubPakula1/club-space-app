"use client";
import { useEffect } from "react";
import { getMQTTClient } from "@/lib/mqtt";
import { toast } from "react-hot-toast";
import { Orbitron } from "next/font/google";
import "./styles/globals.css";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import ToasterProvider from "./components/ToasterProvider/ToasterProvider";
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  useEffect(() => {
    const mqttClient = getMQTTClient();

    mqttClient.on("message", (topic, message) => {
      const data = JSON.parse(message.toString());
      if (data.type === "new_post") {
        toast.success(
          `${data.username} dodał nowy post w grupie ${
            data.groupName
          }: ${data.content.substring(0, 30)}...`,
          {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#363636",
              color: "#fff",
              maxWidth: "500px",
            },
            iconTheme: {
              primary: "#4caf50",
              secondary: "#fff",
            },
          }
        );
      }
    });
  }, []);
  return (
    <html lang="en" className={orbitron.variable}>
      <body>
        <AuthProvider>
          <Navigation />
          {children}
          <ToasterProvider />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
