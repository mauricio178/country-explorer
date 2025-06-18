"use client";
import { systemPaths } from "@/constants/paths";
import { usePathname, useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function BreadCrumb() {
  const router = useRouter();

  const pathname = usePathname();

  const paths = [
    {
      name: "Início",
      path: systemPaths.home,
    },
    {
      name: "Favoritos",
      path: systemPaths.favorites,
    },
  ];

  return (
    <div className={styles.container}>
      {paths.map((item, index) => (
        <p
          key={item.path}
          className={pathname === item.path ? styles.active : ""}
          onClick={() => router.push(item.path)}
        >
          {index > 0 && " / "}
          {item.name}
        </p>
      ))}
    </div>
  );
}
