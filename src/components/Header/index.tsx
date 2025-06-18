"use client";
import { systemPaths } from "@/constants/paths";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Header() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div
        className={styles.logo}
        onClick={() => router.push(systemPaths.home)}
        title="Página inicial"
      >
        <a href={systemPaths.home}>
          <img src="/full-logo.png" alt="Country Explorer" />
        </a>
      </div>
    </div>
  );
}
