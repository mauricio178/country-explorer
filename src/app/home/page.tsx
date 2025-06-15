"use client";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import CountryCard from "../components/CountryCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Input from "../components/Input";
import LoadingGif from "../components/LoadingGif";
import { COUNTRY_PATHS } from "../constants/paths";
import { CountryProps, CountryRequestProps } from "../types/types";
import styles from "./page.module.css";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<CountryProps[]>([]);

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
        response.map((country: CountryRequestProps) => ({
          name: country.name.common,
          flags: {
            png: country.flags.png,
            svg: country.flags.svg,
          },
          favorite: false,
        }))
      );
    }
  };

  const getCountriesBySearch = async (search: string) => {
    setIsLoading(true);
    if (search.length > 0) {
      console.log({ search });
      console.log({ countries });
    }

    setTimeout(() => {
      setIsLoading(false);
      toast("Países carregados com sucesso");
    }, 2000);
  };

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    getCountriesBySearch(search);
  }, [search]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <div className={styles.titlePage}>
          <h2>Procure por Países</h2>
        </div>

        <div className={styles.head}>
          <Input
            placeholder="Pesquisar"
            type="text"
            value={search}
            onChange={setSearch}
            icon={<MdSearch />}
          />

          <div className={styles.filter}></div>
        </div>

        <ul className={styles.countries}>
          {isLoading ? (
            <div className={styles.loading}>
              <LoadingGif />
            </div>
          ) : (
            <>
              {countries.map((country: CountryProps) => (
                <CountryCard
                  key={country.name}
                  name={country.name}
                  flag={country.flags.png}
                  favorite={country.favorite}
                  handleFavorite={() => {}}
                />
              ))}
            </>
          )}
        </ul>
      </div>

      <Footer />
    </div>
  );
}
