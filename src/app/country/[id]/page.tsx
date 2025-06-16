"use client";

import { systemPaths } from "@/constants/paths";
import { STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import { CountryRequestProps } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ id: string }>;
};

type CountryInfo = {
  name: string;
  nativeName: string;
  flag: string;
  capital: string;
  population: number;
  area: number;
  languages: string;
  favorite: boolean;
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

    console.log({ country });

    const formattedCountry = {
      name: country.name.common,
      nativeName:
        // @ts-expect-error - This is a workaround to get the native name of the country
        Object.values(country.name.nativeName || {})[0]?.official || "",
      flag: country.flags.png,
      capital: country.capital,
      population: country.population,
      area: country.area,
      languages: country.languages,
      favorite: country.favorite,
    };

    setCountry(formattedCountry);
  }

  function redirect(path: string) {
    router.push(path);
  }

  useEffect(() => {
    if (!id) return;
    getCountryInfo();
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.backButton}>
          <FaArrowLeft onClick={() => redirect(systemPaths.home)} />{" "}
          <p>Voltar</p>
        </div>

        <div className={styles.favoriteButton}>
          {country?.favorite ? <FaHeart /> : <FaRegHeart />}
        </div>
      </div>

      <div className={styles.countryDetails}>
        <div className={styles.countryImage}>
          <img src={country?.flag} alt={country?.name} />
        </div>

        <div className={styles.countryInfo}>
          <h1>{country?.name}</h1>
          <p>{country?.capital}</p>
          <span>{country?.nativeName}</span>
        </div>
      </div>
    </div>
  );
}
