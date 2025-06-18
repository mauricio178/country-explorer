import { systemPaths } from "@/constants/paths";
import { Order } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";
import { BsFilter } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import BreadCrumb from "../BreadCrumb";
import Input from "../Input";
import styles from "./page.module.css";

export enum FiltersTypes {
  ORDER = "order",
  FAVORITES = "favorites",
}

export interface FilterProps {
  order: string;
  favorites: string[];
  handleOrder: (type: FiltersTypes, order?: Order) => void;
  onClear: () => void;
  continents: string[];
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
    onClear,
    continents,
  } = props;

  const router = useRouter();

  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <BreadCrumb />

      <div className={styles.content}>
        <div className={styles.filterGroup}>
          <h3>
            <BsFilter />
          </h3>

          <div className={styles.filterPopUp}>
            <div>
              <span>Continente</span>
              {continents.map((continent: string) => (
                <div key={continent} className={styles.checkbox}>
                  <input className={styles.checkboxInput} type="checkbox" />
                  <p>{continent}</p>
                </div>
              ))}
            </div>

            <div>
              <span>Ordenação</span>
              <div className={styles.order}>
                <div
                  onClick={() =>
                    handleOrder(
                      FiltersTypes.ORDER,
                      order === Order.ASC ? Order.DESC : Order.ASC
                    )
                  }
                >
                  <p className={order === Order.DESC ? styles.active : ""}>A</p>{" "}
                  <FaArrowRight
                    className={
                      order === Order.ASC ? styles.arrowRight : styles.arrowLeft
                    }
                  />{" "}
                  <p className={order === Order.ASC ? styles.active : ""}>Z</p>
                </div>
              </div>
            </div>
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
          onClear={onClear}
        />

        <div
          className={`${styles.favorites}`}
          title={
            pathname === systemPaths.favorites
              ? "Ver lista de países"
              : "Ver favoritos"
          }
          onClick={() =>
            pathname !== systemPaths.favorites
              ? router.push(systemPaths.favorites)
              : router.push(systemPaths.home)
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
