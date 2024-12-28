import { Geist, Geist_Mono, Inter, Orbitron, Rajdhani } from "next/font/google";
import "./styles/globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

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
export const metadata = {
  title: "ClubSpace",
  description: "Platform created to connect clubs of p",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={orbitron.variable}>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
