import { FaArrowRight } from "react-icons/fa6";

import { Order } from "@/types/types";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from "./page.module.css";

export enum FiltersTypes {
  ORDER = "order",
  FAVORITES = "favorites",
}

export interface FilterProps {
  order: string;
  favorites: string[];
  handleOrder: (type: FiltersTypes, order?: Order) => void;
  activeFilter: FiltersTypes;
}

export default function Filters(props: FilterProps) {
  const { order = Order.ASC, handleOrder, activeFilter, favorites } = props;

  return (
    <div className={styles.container}>
      <div className={styles.order}>
        <div
          onClick={() =>
            handleOrder(
              FiltersTypes.ORDER,
              order === Order.ASC ? Order.DESC : Order.ASC
            )
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
          activeFilter === FiltersTypes.FAVORITES ? styles.favoritesActive : ""
        }`}
        onClick={() => handleOrder(FiltersTypes.FAVORITES)}
      >
        <p>{favorites.length}</p>
        {activeFilter === FiltersTypes.FAVORITES ? (
          <MdFavorite />
        ) : (
          <MdFavoriteBorder />
        )}
      </div>
    </div>
  );
}
