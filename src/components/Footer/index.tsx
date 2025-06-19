import styles from "./page.module.css";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/full-logo.png" alt="Country Explorer" />
      </div>
      <p>℗</p>
    </div>
  );
}
