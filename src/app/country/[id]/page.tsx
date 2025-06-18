"use client";

import { systemPaths } from "@/constants/paths";
import { STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import { CountryRequestProps } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsTranslate } from "react-icons/bs";
import {
  FaArrowLeft,
  FaCoins,
  FaFlag,
  FaGlobe,
  FaHeart,
  FaLanguage,
  FaMapPin,
  FaRegHeart,
  FaTag,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ id: string }>;
};

type CountryInfo = {
  name: string;
  nativeName: string;
  flag: string;
  capital: string;
  languages: string;
  currencies: string;
  region: string;
  independent: boolean;
  subregion: string;
  favorite: boolean;
  cioc: string;
};

export default function CountryPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [country, setCountry] = useState<CountryInfo | null>(null);

  async function getCountryInfo() {
    const storageCountry = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

    if (!storageCountry) return;

    const countries = JSON.parse(storageCountry);
    const country = countries.find(
      (country: CountryRequestProps) => country.id === id
    );

    if (!country) return;

    const formattedCountry: CountryInfo = {
      name: country.name.common,
      nativeName:
        // @ts-expect-error - This is a workaround to get the native name of the country
        Object.values(country.name.nativeName || {})[0]?.official || "",
      flag: country.flags.png,
      capital: country.capital,
      // @ts-expect-error - This is a workaround to get the native name of the country
      currencies: Object.values(country.currencies || {})[0]?.name || "",
      region: country.region,
      subregion: country.subregion,
      languages: Object.values(country.languages || {}).join(", ") || "",
      favorite: country.favorite,
      independent: country.independent,
      cioc: country.cioc,
    };

    setCountry(formattedCountry);
  }

  function redirect(path: string) {
    router.push(path);
  }

  function handleFavorite() {
    const storageCountry = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

    if (!storageCountry) return;

    const countries = JSON.parse(storageCountry);

    const newCountries = countries.map((country: CountryRequestProps) => {
      if (country.id === id) {
        return { ...country, favorite: !country.favorite };
      }
      return country;
    });

    localStorage.setItem(
      STORAGE_KEY_ALL_COUNTRIES,
      JSON.stringify(newCountries)
    );
    getCountryInfo();
  }

  useEffect(() => {
    if (!id) {
      redirect(systemPaths.home);
      return;
    }

    getCountryInfo();
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div
          className={styles.backButton}
          onClick={() => redirect(systemPaths.home)}
        >
          <FaArrowLeft /> <p>Voltar</p>
        </div>

        <div
          title={`${country?.favorite ? "remover " : "favoritar"}`}
          className={styles.favoriteButton}
          onClick={handleFavorite}
        >
          {country?.favorite ? (
            <>
              <p>removido favorito</p>
              <FaHeart />
            </>
          ) : (
            <>
              <p>favorito</p>
              <FaRegHeart />
            </>
          )}
        </div>
      </div>

      <div className={styles.countryData}>
        <div className={styles.countryFlag}>
          <img src={country?.flag} alt={country?.name} />
        </div>

        <div className={styles.countryInfo}>
          <h1>
            <p>
              <FaTag /> Nome
            </p>
            {country?.name}
          </h1>
          <h1>
            <p>
              <FaLanguage /> Nome Nativo
            </p>
            {country?.nativeName || "-"}
          </h1>
        </div>
      </div>

      <div className={styles.moreDetails}>
        <span>
          <p>
            <FaMapPin /> Continente
          </p>
          {country?.region || "-"}
        </span>
        <span>
          <p>
            <FaGlobe /> Subregião
          </p>
          {country?.subregion || "-"}
        </span>
        <span>
          <p>
            <FaLocationDot /> Capital
          </p>
          {country?.capital && country?.capital.length > 0
            ? country?.capital
            : "-"}
        </span>
        <span>
          <p>
            <FaCoins /> Moeda
          </p>
          {country?.currencies || "-"}
        </span>
        <span>
          <p>
            <BsTranslate />
            Idioma(s)
          </p>
          {country?.languages || "-"}
        </span>
        <span>
          <p>
            <FaFlag /> Independente
          </p>
          {country?.independent ? "Sim" : "Não"}
        </span>
      </div>
    </div>
  );
}
