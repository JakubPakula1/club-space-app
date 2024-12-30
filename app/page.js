import Header from "./components/Header";
import homepage from "@/app/styles/HomePage.module.css";
export default function Home() {
  return (
    <div className={homepage.container}>
      <Header />
      <button className={homepage.button}>LOG IN!/SIGN IN!</button>
    </div>
  );
}
