"use client";
import { systemPaths } from "@/constants/paths";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";

export default function BreadCrumb() {
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
      {paths.map((item) => (
        <p
          key={item.path}
          className={pathname === item.path ? styles.active : ""}
        >
          {pathname === item.path && item.name}
        </p>
      ))}
    </div>
  );
}
