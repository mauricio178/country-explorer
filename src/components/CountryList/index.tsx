import { CountryRequestProps } from "../../types/types";
import Animation, { AnimationType } from "../Animations";
import CountryCard from "../CountryCard";
import styles from "./page.module.css";

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

  const noResults = filteredCountries.length === 0 && search !== "";

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
                <p>Buscando...</p>
                <Animation
                  type={AnimationType.LOAD_SEARCH}
                  size={{ width: "150px", height: "150px" }}
                />
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
                        country={country}
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
            {filteredCountries.length === 0 && search === ""
              ? countries.length
              : filteredCountries.length}{" "}
          </strong>
          de <strong> {countries.length}</strong> países
        </p>
        <p className={styles.favoritesCounter}>
          Favorito
          {countries.filter((country) => country.favorite).length > 1 &&
            "s"}{" "}
          <strong>
            {countries.filter((country) => country.favorite).length}
          </strong>
        </p>
      </div>
    </div>
  );
}
