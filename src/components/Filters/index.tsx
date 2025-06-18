import { FaArrowRight } from "react-icons/fa6";

import { Order } from "@/types/types";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from "./page.module.css";
import Input from "../Input";
import BreadCrumb from "../BreadCrumb";
import { usePathname } from "next/navigation";
import { systemPaths } from "@/constants/paths";

export enum FiltersTypes {
  ORDER = "order",
  FAVORITES = "favorites",
}

export interface FilterProps {
  order: string;
  favorites: string[];
  handleOrder: (type: FiltersTypes, order?: Order) => void;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

export default function Filters(props: FilterProps) {
  const {
    order = Order.ASC,
    handleOrder,
    favorites,
    placeholder,
    value,
    onChange,
    icon,
  } = props;

  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <BreadCrumb />

      <div className={styles.content}>
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

        <Input
          placeholder={placeholder || ""}
          type="text"
          value={value || ""}
          onChange={(e) =>
            onChange &&
            onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          icon={icon}
        />

        <div
          className={`${styles.favorites}`}
          onClick={() =>
            pathname !== systemPaths.favorites &&
            handleOrder(FiltersTypes.FAVORITES)
          }
        >
          <p>{favorites.length}</p>

          {pathname === systemPaths.favorites ? (
            <MdFavorite />
          ) : (
            <MdFavoriteBorder />
          )}
        </div>
      </div>
    </div>
  );
}
