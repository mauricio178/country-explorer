"use client";

import {
  MdFavoriteBorder,
  MdOutlineFavorite,
  MdOutlineOpenInNew,
} from "react-icons/md";

import { CountryRequestProps } from "@/types/types";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { systemPaths } from "@/constants/paths";

interface CountryCardProps {
  country: CountryRequestProps;
  handleFavorite: () => void;
}

export default function CountryCard(props: CountryCardProps) {
  const { country, handleFavorite } = props;

  const router = useRouter();

  function redirect(id: string) {
    router.push(id);
  }

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

        <p>
          {/* @ts-expect-error: Object.values(country.name.nativeName)[0] is not a function */}
          {Object.values(country.name.nativeName)[0]?.official ||
            country.name.official}
        </p>
      </div>

      <div
        className={
          country.favorite
            ? styles.favoriteShow
            : styles.favoriteShowOnlyOnHover
        }
      >
        <MdOutlineOpenInNew
          onClick={() => redirect(systemPaths.countryId(country.id))}
          className={styles.link}
        />
        {country.favorite ? (
          <MdOutlineFavorite onClick={handleFavorite} />
        ) : (
          <MdFavoriteBorder onClick={handleFavorite} />
        )}
      </div>
    </li>
  );
}
