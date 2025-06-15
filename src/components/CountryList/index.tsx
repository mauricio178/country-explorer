import { CountryRequestProps } from "../../types/types";
import styles from "./page.module.css";
import Animation, { AnimationType } from "../Animations";
import CountryCard from "../CountryCard";

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

  return (
    <ul className={styles.countries}>
      {filteredCountries.length === 0 && search.length > 0 ? (
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
  );
}
