import { systemPaths } from "@/constants/paths";
import { ALL_CONTINENTS, INDEPENDENT_LABELS } from "@/constants/varibles";
import { Order } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";
import { BsFilter } from "react-icons/bs";
import { FaArrowRight, FaFlag, FaGlobe, FaSort, FaTimes } from "react-icons/fa";
import { LuFlagOff } from "react-icons/lu";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import BreadCrumb from "../BreadCrumb";
import Input from "../Input";
import styles from "./page.module.css";

export enum FiltersTypes {
  ORDER = "order",
  CONTINENTS = "continents",
  SEARCH = "search",
  INDEPENDENT = "independent",
  INDEPENDENT_FALSE = "independentFalse",
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
              <span>
                <FaGlobe /> Continente
              </span>
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
              <span>
                <FaFlag /> Independente
              </span>
              <div className={styles.checkboxRow}>
                <div
                  className={
                    activeFilters.includes(FiltersTypes.INDEPENDENT)
                      ? styles.checkboxActive
                      : styles.checkbox
                  }
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(FiltersTypes.INDEPENDENT)}
                    style={{
                      cursor: activeFilters.includes(
                        FiltersTypes.INDEPENDENT_FALSE
                      )
                        ? "not-allowed"
                        : "pointer",
                    }}
                    disabled={activeFilters.includes(
                      FiltersTypes.INDEPENDENT_FALSE
                    )}
                    onChange={() =>
                      handleFilter(
                        FiltersTypes.INDEPENDENT,
                        undefined,
                        FiltersTypes.INDEPENDENT
                      )
                    }
                    className={styles.checkboxInput}
                  />
                  <p>Sim</p>
                </div>

                <div
                  className={
                    activeFilters.includes(FiltersTypes.INDEPENDENT)
                      ? styles.checkboxActive
                      : styles.checkbox
                  }
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(
                      FiltersTypes.INDEPENDENT_FALSE
                    )}
                    style={{
                      cursor: activeFilters.includes(FiltersTypes.INDEPENDENT)
                        ? "not-allowed"
                        : "pointer",
                    }}
                    disabled={activeFilters.includes(FiltersTypes.INDEPENDENT)}
                    onChange={() =>
                      handleFilter(
                        FiltersTypes.INDEPENDENT,
                        undefined,
                        FiltersTypes.INDEPENDENT_FALSE
                      )
                    }
                    className={styles.checkboxInput}
                  />
                  <p>Não</p>
                </div>
              </div>
            </div>

            <div>
              <span>
                <FaSort /> Ordenação
              </span>
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
          <p>Filtros:</p>
          {activeFilters.map((filter) => {
            return (
              <span key={filter}>
                {filter === FiltersTypes.INDEPENDENT ||
                filter === FiltersTypes.INDEPENDENT_FALSE ? (
                  filter === FiltersTypes.INDEPENDENT ? (
                    <FaFlag className={styles.flag} />
                  ) : (
                    <LuFlagOff className={styles.flag} />
                  )
                ) : (
                  <FaGlobe
                    className={styles.globe}
                    style={{
                      color: ALL_CONTINENTS.find((c) => c.name === filter)
                        ?.color,
                    }}
                  />
                )}
                {filter === FiltersTypes.INDEPENDENT ||
                filter === FiltersTypes.INDEPENDENT_FALSE
                  ? INDEPENDENT_LABELS[filter]
                  : filter}
                <FaTimes
                  onClick={() =>
                    handleFilter(
                      filter === FiltersTypes.INDEPENDENT ||
                        filter === FiltersTypes.INDEPENDENT_FALSE
                        ? FiltersTypes.INDEPENDENT
                        : FiltersTypes.CONTINENTS,
                      undefined,
                      filter
                    )
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
