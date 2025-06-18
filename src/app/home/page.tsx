"use client";
import {
  CountrySpecification,
  getCountriesEspecification,
} from "@/actions/countries";
import CountryList from "@/components/CountryList";
import Filters, { FiltersTypes } from "@/components/Filters";
import { systemPaths } from "@/constants/paths";
import { LABELS, STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import { useFilters } from "@/hooks/useFilters";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { ActionTypes, CountryRequestProps, Order } from "../../types/types";
import styles from "./page.module.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<CountryRequestProps[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [continents, setContinents] = useState<string[]>([]);

  const router = useRouter();

  const { state, dispatch } = useFilters();

  const onLoadScreen = async () => {
    setIsLoading(true);
    const storageCountries = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);
    const parsedCountries = JSON.parse(storageCountries || "[]");

    if (parsedCountries.length > 0) {
      console.log({ parsedCountries });
      setCountries(parsedCountries);
      setIsLoading(false);
      return;
    }

    getContinents();

    const countriesResponse = await getCountriesEspecification(
      CountrySpecification.ALL
    );

    if (!countriesResponse) return;

    const formattedCountries = countriesResponse
      .sort((a: CountryRequestProps, b: CountryRequestProps) =>
        a.name.common.localeCompare(b.name.common)
      )
      .map((country: CountryRequestProps) => {
        const ramdomID = crypto.randomUUID();
        return {
          ...country,
          id: ramdomID,
          favorite: false,
        };
      });

    setCountries(formattedCountries);
    toast.success(LABELS.COUNTRIES_LOADED_SUCCESSFULLY);
    localStorage.setItem(
      STORAGE_KEY_ALL_COUNTRIES,
      JSON.stringify(formattedCountries)
    );
    setIsLoading(false);
  };

  const getContinents = () => {
    const allCountries = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);
    const parsedCountries = JSON.parse(allCountries || "[]");

    const allContinents: string[] = [];

    parsedCountries.forEach((country: CountryRequestProps) => {
      if (!allContinents.includes(country.region)) {
        allContinents.push(country.region);
      }
    });
    setContinents(allContinents);
  };

  const handleFavorite = (country: CountryRequestProps) => {
    const newCountries = countries.map((c) =>
      c.id === country.id ? { ...c, favorite: !c.favorite } : c
    );

    if (newCountries.some((c) => c.favorite)) {
      toast.success(LABELS.COUNTRY_ADDED_TO_FAVORITES);
    }

    localStorage.setItem(
      STORAGE_KEY_ALL_COUNTRIES,
      JSON.stringify(newCountries)
    );

    setCountries(newCountries);
  };

  function getCountriesBySearch(search: string) {
    const countriesStorage = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

    if (search === "") {
      setFilteredCountries([]);
      setCountries(JSON.parse(countriesStorage || "[]"));
      return;
    }

    const filteredIds: string[] = [];

    function normalizeString(string: string) {
      return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    countries?.forEach((country) => {
      if (
        normalizeString(country.name.common).includes(normalizeString(search))
      ) {
        filteredIds.push(country.id);
      }
    });

    setFilteredCountries(filteredIds);
  }

  const handleOrder = (type: FiltersTypes, order?: Order) => {
    setIsLoading(true);

    switch (type) {
      case FiltersTypes.ORDER:
        dispatch({ type: ActionTypes.SET_ORDER, payload: order || Order.ASC });
        break;
      case FiltersTypes.FAVORITES:
        router.push(systemPaths.favorites);
        dispatch({
          type: ActionTypes.SET_FAVORITES,
          payload: !state.favorites,
        });
        break;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    onLoadScreen();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(state.search);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [state.search]);

  useEffect(() => {
    if (debouncedQuery) {
      getCountriesBySearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.content}>
        <Filters
          order={state.order}
          favorites={countries.filter((c) => c.favorite).map((c) => c.id)}
          handleOrder={handleOrder}
          placeholder={LABELS.SEARCH_BY_COUNTRY_NAME}
          value={state.search}
          onChange={(e) =>
            dispatch({
              type: ActionTypes.SET_SEARCH,
              payload: e.target.value as string,
            })
          }
          continents={continents}
          onClear={() => {
            dispatch({
              type: ActionTypes.SET_SEARCH,
              payload: "",
            });
            getCountriesBySearch("");
          }}
          icon={<MdSearch />}
        />

        <div className={styles.list}>
          <CountryList
            countries={countries.sort((a, b) => {
              if (state.order === Order.ASC) {
                return a.name.common.localeCompare(b.name.common);
              }
              return b.name.common.localeCompare(a.name.common);
            })}
            filteredCountries={filteredCountries}
            search={state.search}
            isLoading={isLoading}
            handleFavorite={handleFavorite}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
