/* eslint-disable react/jsx-no-undef */
"use client";

import {
  CountrySpecification,
  getCountriesEspecification,
} from "@/actions/countries";
import CountryList from "@/components/CountryList";
import { STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import { useFilters } from "@/hooks/useFilters";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { CountryRequestProps } from "../../types/types";
import styles from "./page.module.css";
import Filters from "@/components/Filters";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<CountryRequestProps[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const { state, dispatch } = useFilters();

  const onLoadScreen = async () => {
    setIsLoading(true);
    const countriesResponse = await getCountriesEspecification(
      CountrySpecification.ALL
    );

    // const regionCountriesResponse = await getCountriesEspecification(
    //   CountrySpecification.REGION,
    //   "europe"
    // );

    console.log({ countriesResponse });

    if (countriesResponse) {
      setCountries(
        countriesResponse
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map((country: CountryRequestProps) => {
            const id = crypto.randomUUID();

            return {
              ...country,
              id,
              favorite: false,
            };
          })
      );

      localStorage.setItem(
        STORAGE_KEY_ALL_COUNTRIES,
        JSON.stringify(countriesResponse)
      );
    }

    setIsLoading(false);
  };

  const handleFavorite = (country: CountryRequestProps) => {
    toast.success(`${country.name.common} adicionado aos favoritos!`);
  };

  function getCountriesBySearch() {
    setIsLoading(true);

    let filteredIds: string[] = [];

    function normalizeString(string: string) {
      return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    if (state.search) {
      countries?.forEach((country) => {
        if (
          normalizeString(country.name.common).includes(
            normalizeString(state.search)
          )
        ) {
          filteredIds.push(country.id);
        }
      });
    }

    if (state.search === "") {
      filteredIds = [];
    }

    setTimeout(() => {
      setFilteredCountries(filteredIds);
      if (filteredIds.length === 0) {
        toast.error("Nenhum país encontrado");
      }
      setIsLoading(false);
    }, 1000);
  }

  useEffect(() => {
    onLoadScreen();
  }, []);

  useEffect(() => {
    getCountriesBySearch();
  }, [state.search]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <Filters />

        <Input
          placeholder="Pesquisar"
          type="text"
          value={state.search}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e })}
          icon={<MdSearch />}
        />

        <CountryList
          countries={countries}
          filteredCountries={filteredCountries}
          search={state.search}
          isLoading={isLoading}
          handleFavorite={handleFavorite}
        />
      </div>

      <Footer />
    </div>
  );
}
