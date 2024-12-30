import Header from "./components/Header";
import homepage from "@/app/styles/HomePage.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={homepage.container}>
      <Header />
      <Link href="/auth">
        <button className={homepage.button}>LOG IN!/SIGN IN!</button>
      </Link>
    </div>
  );
}
