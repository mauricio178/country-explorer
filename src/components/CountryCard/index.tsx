import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";

import styles from "./page.module.css";
import { CountryRequestProps } from "@/types/types";

interface CountryCardProps {
  country: CountryRequestProps;
  handleFavorite: () => void;
}

export default function CountryCard(props: CountryCardProps) {
  const { country, handleFavorite } = props;

  return (
    <li
      className={`${styles.container} ${
        country.favorite ? styles.favorite : ""
      }`}
    >
      <div className={styles.flag}>
        <img src={country.flags.png} alt={country.name.common} />
      </div>

      <div className={styles.countryInfo}>
        <h5>{country.name.common}</h5>
        <p>{country.name.official}</p>
      </div>

      <div
        onClick={handleFavorite}
        className={
          country.favorite
            ? styles.favoriteShow
            : styles.favoriteShowOnlyOnHover
        }
      >
        {country.favorite ? <MdOutlineFavorite /> : <MdFavoriteBorder />}
      </div>
    </li>
  );
}
