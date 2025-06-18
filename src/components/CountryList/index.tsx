import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CountryRequestProps } from "../../types/types";
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
        {isLoading ? (
          <div className={styles.loading}>
            <p>Buscando...</p>
            <DotLottieReact
              style={{ width: "150px", height: "150px" }}
              src={`/load-search.lottie`}
              autoplay
              loop
            />
          </div>
        ) : (
          <>
            {noResults ? (
              <div className={styles.noResults}>
                <p>
                  Oops, Nenhum país encontrado com este nome:{" "}
                  <strong>{search}</strong>
                </p>
                <DotLottieReact
                  style={{ width: "200px", height: "200px" }}
                  src={`/not-found.lottie`}
                  autoplay
                  loop
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
      </div>
    </div>
  );
}
