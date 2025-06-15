import { CountryRequestProps } from "../../types/types";
import styles from "./page.module.css";
import Animation, { AnimationType } from "../Animations";
import CountryCard from "../CountryCard";
import { useFilters } from "@/hooks/useFilters";
import { FILTERS_STORAGE_KEY } from "@/constants/varibles";

interface CountryListProps {
  countries: CountryRequestProps[];
  filteredCountries: string[];
  search: string;
  isLoading: boolean;
  handleFavorite: (country: CountryRequestProps) => void;
}

export default function CountryList(props: CountryListProps) {
  const { countries, filteredCountries, search, isLoading, handleFavorite } =
    props;

  const filterStorage = localStorage.getItem(FILTERS_STORAGE_KEY);
  const filterStorageParsed = JSON.parse(filterStorage || "{}");

  console.log({ filterStorageParsed });
  const noResults =
    filteredCountries.length === 0 && search !== "" && !isLoading;

  return (
    <div className={styles.container}>
      <ul className={noResults ? styles.countriesNoResults : styles.countries}>
        {noResults ? (
          <div className={styles.noResults}>
            <p>
              Oops, Nenhum país encontrado com este nome:{" "}
              <strong>{search}</strong>
            </p>
            <Animation
              type={AnimationType.NOT_FOUND}
              size={{ width: "200px", height: "200px" }}
            />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className={styles.loading}>
                <Animation type={AnimationType.LOAD_SEARCH} />
              </div>
            ) : (
              <>
                {countries.map((country: CountryRequestProps) => {
                  if (
                    filteredCountries.length === 0 ||
                    filteredCountries.includes(country.id)
                  ) {
                    return (
                      <CountryCard
                        key={country.id}
                        name={country.name.common}
                        flag={country.flags.png}
                        favorite={country.favorite}
                        handleFavorite={() => handleFavorite(country)}
                      />
                    );
                  }
                })}
              </>
            )}
          </>
        )}
      </ul>
      <div className={styles.counter}>
        <p>
          Mostrando{" "}
          <strong>
            {filteredCountries.length === 0 && filterStorageParsed.search === ""
              ? countries.length
              : filteredCountries.length}{" "}
          </strong>
          de <strong> {countries.length}</strong> países
        </p>
      </div>
    </div>
  );
}
