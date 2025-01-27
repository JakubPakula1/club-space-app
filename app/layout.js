"use client";
import { useEffect } from "react";
import { getMQTTClient } from "@/lib/mqtt";
import { Toaster, toast } from "react-hot-toast";
import { Orbitron } from "next/font/google";
import "./styles/globals.css";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
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
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4caf50",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#f44336",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
