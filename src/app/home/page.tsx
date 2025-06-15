/* eslint-disable react/jsx-no-undef */
"use client";

import CountryList from "@/components/CountryList";
import { STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { COUNTRY_PATHS } from "../../constants/paths";
import { CountryRequestProps } from "../../types/types";
import styles from "./page.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<CountryRequestProps[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const [search, setSearch] = useState("");

  const getCountries = async () => {
    const response = await api
      .get<CountryRequestProps[]>(COUNTRY_PATHS.ALL, {
        params: {
          fields: "name,flags",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return null;
      });

    if (response) {
      setCountries(
        response
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

      localStorage.setItem(STORAGE_KEY_ALL_COUNTRIES, JSON.stringify(response));
    }
  };

  const handleFavorite = (country: CountryRequestProps) => {
    toast.success(`${country.name.common} adicionado aos favoritos!`);
  };

  function getCountriesBySearch() {
    if (search.length === 0) {
      setFilteredCountries([]);
      return;
    }

    setIsLoading(true);

    const filteredIds: string[] = [];

    function normalizeString(string: string) {
      return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    if (search) {
      countries?.forEach((country) => {
        if (
          normalizeString(country.name.common).includes(normalizeString(search))
        ) {
          filteredIds.push(country.id);
        }
      });
    }

    setTimeout(() => {
      setFilteredCountries(filteredIds);

      if (filteredIds.length === 0) {
        toast.error("Nenhum país encontrado");
      }

      setIsLoading(false);
    }, 300);
  }

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    getCountriesBySearch();
  }, [search]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <div className={styles.titlePage}>
          <div className={styles.order}>
            <h2>Ordenar</h2>
            <div>
              <p>AZ</p>
            </div>
          </div>
        </div>

        <Input
          placeholder="Pesquisar"
          type="text"
          value={search}
          onChange={setSearch}
          icon={<MdSearch />}
        />

        <CountryList
          countries={countries}
          filteredCountries={filteredCountries}
          search={search}
          isLoading={isLoading}
          handleFavorite={handleFavorite}
        />

        <div className={styles.counter}>
          <p>
            Mostrando{" "}
            <strong>
              {filteredCountries.length === 0
                ? countries.length
                : filteredCountries.length}{" "}
            </strong>
            de <strong> {countries.length}</strong> países
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
