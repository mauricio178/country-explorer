"use client";

import CountryList from "@/components/CountryList";
import Filters, { FiltersTypes } from "@/components/Filters";
import { systemPaths } from "@/constants/paths";
import { LABELS, STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import { useFilters } from "@/hooks/useFilters";
import { ActionTypes, CountryRequestProps, Order } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const router = useRouter();

  const { state, dispatch } = useFilters();

  const [countries, setCountries] = useState<CountryRequestProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

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

  function getCountriesBySearch() {
    if (isLoading) return;

    setIsLoading(true);

    const countriesStorage = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

    if (state.search === "") {
      setFilteredCountries([]);
      setCountries(JSON.parse(countriesStorage || "[]"));
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
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
        normalizeString(country.name.common).includes(
          normalizeString(state.search)
        )
      ) {
        filteredIds.push(country.id);
      }
    });

    setTimeout(() => {
      setFilteredCountries(filteredIds);
      setIsLoading(false);
    }, 1000);
  }

  useEffect(() => {
    getCountriesBySearch();
  }, [state.search]);

  return (
    <div className={styles.container}>
      <div className={styles.favoritesList}>
        <Filters
          order={state.order}
          favorites={countries
            .filter((country) => country.favorite)
            .map((country) => country.id)}
          handleOrder={handleOrder}
          placeholder={LABELS.SEARCH_BY_COUNTRY_NAME}
          value={state.search}
          onChange={(e) =>
            dispatch({
              type: ActionTypes.SET_SEARCH,
              payload: e.target.value as string,
            })
          }
          icon={<MdSearch />}
        />

        <CountryList
          countries={countries
            .filter((country) => country.favorite)
            .sort((a, b) => {
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
  );
}
