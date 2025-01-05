import Link from "next/link";
import navigation from "@/app/styles/Navigation.module.css";

export default function Navigation() {
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
        <Link href="/account">Account</Link>
      </div>
    </nav>
  );
}
