import Link from "next/link";
import navigation from "@/app/styles/Navigation.module.css";
export default function Navigation() {
  return (
    <ul className={navigation.list}>
      <li className={navigation.bar}></li>
      <li className={navigation.item}>
        <Link href="/">Home</Link>
      </li>
      <li className={navigation.bar}></li>
      <li className={navigation.item}>
        <Link href="/groups">All groups</Link>
      </li>
      <li className={navigation.bar}></li>
      <li className={navigation.item}>
        <Link href="#">Your Groups</Link>
      </li>
      <li className={navigation.bar}></li>
      <li className={navigation.item}>
        <Link href="#">Account</Link>
      </li>
      <li className={navigation.bar}></li>
    </ul>
  );
}
