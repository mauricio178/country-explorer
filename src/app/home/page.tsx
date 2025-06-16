"use client";
import {
  CountrySpecification,
  getCountriesEspecification,
} from "@/actions/countries";
import CountryList from "@/components/CountryList";
import { LABELS, STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";
import { useFilters } from "@/hooks/useFilters";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { ActionTypes, CountryRequestProps, Order } from "../../types/types";
import styles from "./page.module.css";
import Filters from "@/components/Filters";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<CountryRequestProps[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const { state, dispatch } = useFilters();

  const onLoadScreen = async () => {
    setIsLoading(true);

    const allCountries = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

    if (allCountries) {
      setCountries(JSON.parse(allCountries));
      setIsLoading(false);
      return;
    }

    const countriesResponse = await getCountriesEspecification(
      CountrySpecification.ALL
    );

    if (!countriesResponse) return;

    const formattedCountries = countriesResponse
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
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

  const handleFavorite = (country: CountryRequestProps) => {
    const newCountries = countries.map((c) =>
      c.id === country.id ? { ...c, favorite: !c.favorite } : c
    );

    if (newCountries.some((c) => c.favorite)) {
      toast.success(LABELS.COUNTRY_ADDED_TO_FAVORITES);
    } else {
      toast.success(LABELS.COUNTRY_REMOVED_FROM_FAVORITES);
    }

    localStorage.setItem(
      STORAGE_KEY_ALL_COUNTRIES,
      JSON.stringify(newCountries)
    );

    setCountries(newCountries);
  };

  function getCountriesBySearch() {
    if (state.search === "") {
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

    setTimeout(() => {
      setFilteredCountries(filteredIds);
      if (filteredIds.length === 0) {
        toast.error(LABELS.NO_COUNTRIES_FOUND);
      }
      setIsLoading(false);
    }, 1000);
  }

  const handleOrder = (type: "order" | "favorites", order?: Order) => {
    setIsLoading(true);

    switch (type) {
      case "order":
        dispatch({ type: ActionTypes.SET_ORDER, payload: order || Order.ASC });
        break;
      case "favorites":
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
    getCountriesBySearch();
  }, [state]);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <Filters
          order={state.order}
          handleOrder={handleOrder}
          activeFilter={state.favorites ? "favorites" : "order"}
        />

        <Input
          placeholder={LABELS.SEARCH_BY_COUNTRY_NAME}
          type="text"
          value={state.search}
          onChange={(e) =>
            dispatch({ type: ActionTypes.SET_SEARCH, payload: e })
          }
          icon={<MdSearch />}
        />

        <CountryList
          countries={
            state.favorites
              ? countries.filter((c) => c.favorite)
              : countries.sort((a, b) => {
                  if (state.order === Order.ASC) {
                    return a.name.common.localeCompare(b.name.common);
                  }
                  return b.name.common.localeCompare(a.name.common);
                })
          }
          filteredCountries={filteredCountries}
          search={state.search}
          isLoading={isLoading}
          handleFavorite={handleFavorite}
        />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
