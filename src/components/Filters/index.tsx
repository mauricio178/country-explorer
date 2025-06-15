import { MdFavorite } from "react-icons/md";
import styles from "./page.module.css";

export default function Filters() {
  return (
    <div className={styles.container}>
      <div className={styles.order}>
        <h2>Ordenar</h2>
        <div>
          <p>AZ</p>
        </div>
      </div>

      <div className={styles.search}>
        <p>
          Mostrar Favoritos <MdFavorite />
        </p>
      </div>
    </div>
  );
}
