import Image from "next/image";
import header from "@/app/styles/Header.module.css";
export default function Header() {
  return (
    <header className={header.headerContainer}>
      <h1>Welcome to ClubSpace!</h1>
      <Image src="/logo.jpeg" alt="logo" width={200} height={200} />
      <p className={header.description}>
        Discover a new space to connect with like-minded people, where
        enthusiasts like you can share interests and create unique communities.
        <br />
        <span className={header.joinUs}>
          Join us and find your place among inspiring individuals!
        </span>
      </p>
    </header>
  );
}
