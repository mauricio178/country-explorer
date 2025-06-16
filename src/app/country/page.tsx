import Header from "@/components/Header";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

export default function CountryPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.content}>
        <h1>Country Page</h1>
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
