"use client";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { COUNTRY_PATHS } from "../constants/paths";
import { CountryProps, CountryRequestProps } from "../types/types";
import styles from "./page.module.css";

export default function Home() {
  const [countries, setCountries] = useState<CountryProps[]>([]);

  const getCountries = async () => {
    const response = await api
      .get<CountryRequestProps[]>(COUNTRY_PATHS.ALL, {
        params: {
          fields: "name,flags",
        },
      })
      .then((response) => {
        return response.data.slice(0, 10);
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return null;
      });

    console.log({ response });

    if (response) {
      setCountries(
        response.map((country: CountryRequestProps) => ({
          name: country.name.common,
          flags: {
            png: country.flags.png,
            svg: country.flags.svg,
          },
        }))
      );
    }

    // setCountries(
    //   response.data
    //     .map((country: CountryRequestProps) => ({
    //       name: country.name.common,
    //       flags: {
    //         png: country.flags.png,
    //         svg: country.flags.svg,
    //       },
    //     }))
    //     .slice(0, 10)
    // );
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className={styles.container}>
      {countries.map((country: CountryProps) => (
        <div key={country.name}>
          <h1>{country.name}</h1>
        </div>
      ))}
    </div>
  );
}
