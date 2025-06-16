import { FaArrowRight } from "react-icons/fa6";

import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from "./page.module.css";
import { Order } from "@/types/types";

export interface FilterProps {
  order: string;
  handleOrder: (type: "order" | "favorites", order?: Order) => void;
  activeFilter: "order" | "favorites";
}

export default function Filters(props: FilterProps) {
  const { order = Order.ASC, handleOrder, activeFilter } = props;

  return (
    <div className={styles.container}>
      <div className={styles.order}>
        <div
          onClick={() =>
            handleOrder("order", order === Order.ASC ? Order.DESC : Order.ASC)
          }
        >
          <strong className={order === Order.DESC ? styles.active : ""}>
            A
          </strong>{" "}
          <FaArrowRight
            className={
              order === Order.ASC ? styles.arrowRight : styles.arrowLeft
            }
          />{" "}
          <strong className={order === Order.ASC ? styles.active : ""}>
            Z
          </strong>
        </div>
      </div>

      <div
        className={`${styles.favorites} ${
          activeFilter === "favorites" ? styles.favoritesActive : ""
        }`}
        onClick={() => handleOrder("favorites")}
      >
        <p>ver favoritos</p>
        {activeFilter === "favorites" ? <MdFavorite /> : <MdFavoriteBorder />}
      </div>
    </div>
  );
}
