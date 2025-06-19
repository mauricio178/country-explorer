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
import { toast } from "react-toastify";
import { LuFlagOff } from "react-icons/lu";

type PageProps = {
  params: Promise<{ id: string }>;
};

type CountryInfo = {
  /*
  Name of the country
  */
  name: string;
  /*
  Native name of the country
  */
  nativeName: string;
  /*
  Flag of the country
  */
  flag: string;
  /*
  Capital of the country
  */
  capital: string;
  /*
  Languages of the country
  */
  languages: string;
  /*
  Currencies of the country
  */
  currencies: {
    name: string;
    symbol: string;
  };
  /*
  Region of the country
  */
  region: string;
  /*
  Independent of the country
  */
  independent: boolean;
  /*
  Subregion of the country
  */
  subregion: string;
  /*
  Cioc of the country
  */
  cioc: string;
  /*
  Favorite of the country
  */
  favorite: boolean;
};

export default function CountryPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [country, setCountry] = useState<CountryInfo | null>(null);
  const router = useRouter();
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
      currencies: {
        // @ts-expect-error - This is a workaround to get the name of the currency
        name: Object.values(country.currencies || {})[0]?.name || "",
        // @ts-expect-error - This is a workaround to get the symbol of the currency
        symbol: Object.values(country.currencies || {})[0]?.symbol || "",
      },
      region: country.region,
      subregion: country.subregion,
      languages: Object.values(country.languages || {}).join(", ") || "",
      favorite: country.favorite,
      independent: country.independent,
      cioc: country.cioc,
    };

    setCountry(formattedCountry);
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

    toast.success(
      country?.favorite
        ? `${country?.name} removido dos favoritos`
        : `${country?.name} adicionado aos favoritos`
    );

    localStorage.setItem(
      STORAGE_KEY_ALL_COUNTRIES,
      JSON.stringify(newCountries)
    );
    getCountryInfo();
  }

  useEffect(() => {
    if (!id) {
      router.push(systemPaths.home);
      return;
    }

    getCountryInfo();
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft /> <p>Voltar</p>
        </div>

        <div
          title={`${country?.favorite ? "remover" : "favoritar"}`}
          className={styles.favoriteButton}
          onClick={handleFavorite}
        >
          {country?.favorite ? (
            <>
              <p>remover favorito</p>
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
          {country?.currencies.name && country?.currencies.symbol
            ? `(${country?.currencies.symbol}) - ${country?.currencies.name}`
            : "-"}
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
            {country?.independent ? <FaFlag /> : <LuFlagOff />} Independente
          </p>
          {country?.independent ? "Sim" : "Não"}
        </span>
      </div>
    </div>
  );
}
