"use client";

import { systemPaths } from "@/constants/paths";
import { CountryRequestProps } from "@/types/types";
import { useRouter } from "next/navigation";
import {
  MdFavoriteBorder,
  MdOutlineFavorite,
  MdOutlineOpenInNew,
} from "react-icons/md";
import styles from "./page.module.css";
import { FaFlag, FaGlobe } from "react-icons/fa";
import { ALL_CONTINENTS } from "@/constants/varibles";
import { LuFlagOff } from "react-icons/lu";

interface CountryCardProps {
  /*
  Country object
  */
  country: CountryRequestProps;
  /*
  Function to handle favorite country
  */
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
          <MdOutlineFavorite
            className={styles.favoriteIcon}
            onClick={handleFavorite}
          />
        ) : (
          <MdFavoriteBorder
            className={styles.favoriteIcon}
            onClick={handleFavorite}
          />
        )}
      </div>

      <div className={styles.category}>
        <FaGlobe
          title={country.region}
          style={{
            color: ALL_CONTINENTS.find((c) => c.name === country.region)?.color,
          }}
        />
        {country.independent ? (
          <FaFlag title="Independente" />
        ) : (
          <LuFlagOff title="Não independente" />
        )}
      </div>
    </li>
  );
}
