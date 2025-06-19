import { systemPaths } from "@/constants/paths";
import { Order } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";
import { BsFilter } from "react-icons/bs";
import { FaArrowRight, FaGlobe, FaTimes } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import BreadCrumb from "../BreadCrumb";
import Input from "../Input";
import styles from "./page.module.css";
import { ALL_CONTINENTS } from "@/constants/varibles";

export enum FiltersTypes {
  ORDER = "order",
  CONTINENTS = "continents",
  SEARCH = "search",
}

export interface FilterProps {
  /*
  Order type
  */
  order: string;
  /*
  Array of favorites
  */
  favorites: string[];
  /*
  Function to handle filter
  */
  handleFilter: (type: FiltersTypes, order?: Order, value?: string) => void;
  /*
  Function to clear search
  */
  onClearSearch: () => void;
  /*
  Array of active filters
  */
  activeFilters: string[];
  /*
  Array of continents
  */
  continents: { id: number; name: string; color: string }[];
  /*
  Placeholder for search input
  */
  placeholder?: string;
  /*
  Value for search input
  */
  value?: string;
  /*
  Icon for search input
  */
  icon?: React.ReactNode;
}

export default function Filters(props: FilterProps) {
  const {
    order = Order.ASC,
    handleFilter,
    favorites,
    placeholder,
    value,
    icon,
    onClearSearch,
    continents,
    activeFilters,
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
              {continents.map((continent) => (
                <div
                  key={continent.name}
                  className={
                    activeFilters.includes(continent.name)
                      ? styles.checkboxActive
                      : styles.checkbox
                  }
                >
                  <input
                    onChange={() =>
                      handleFilter(
                        FiltersTypes.CONTINENTS,
                        undefined,
                        continent.name
                      )
                    }
                    checked={activeFilters.includes(continent.name)}
                    className={styles.checkboxInput}
                    type="checkbox"
                  />
                  <p>{continent.name}</p>
                </div>
              ))}
            </div>

            <div>
              <span>Ordenação</span>
              <div className={styles.order}>
                <div
                  onClick={() =>
                    handleFilter(
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
          onChange={(e) => {
            handleFilter(
              FiltersTypes.SEARCH,
              undefined,
              e.target.value as string
            );
          }}
          icon={icon}
          onClear={onClearSearch}
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

      {activeFilters.length > 0 && (
        <div className={styles.filter}>
          <p>filtrando:</p>
          {activeFilters.map((continent) => {
            return (
              <span key={continent}>
                <FaGlobe
                  className={styles.globe}
                  style={{
                    color: ALL_CONTINENTS.find((c) => c.name === continent)
                      ?.color,
                  }}
                />
                {continent}
                <FaTimes
                  onClick={() =>
                    handleFilter(FiltersTypes.CONTINENTS, undefined, continent)
                  }
                />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
