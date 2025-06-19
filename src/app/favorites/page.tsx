"use client";

import CountryList from "@/components/CountryList";
import Filters, { FiltersTypes } from "@/components/Filters";
import {
  ALL_CONTINENTS,
  LABELS,
  STORAGE_KEY_ALL_COUNTRIES,
} from "@/constants/varibles";
import { useFilters } from "@/hooks/useFilters";
import { ActionTypes, CountryRequestProps, Order } from "@/types/types";
import { useEffect, useState } from "react";
import { LiaHeartBrokenSolid } from "react-icons/lia";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import styles from "./page.module.css";

export default function FavoritesPage() {
  const { state, dispatch } = useFilters();

  const [countries, setCountries] = useState<CountryRequestProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const onLoadScreen = async () => {
    const countriesStorage = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);
    setCountries(JSON.parse(countriesStorage || "[]"));
    updateActiveFilters();
  };

  function updateActiveFilters() {
    const continentsArray =
      state.continents.length > 0 ? state.continents.map((c) => c) : [];
    const independentArray =
      state.independent.length > 0 ? state.independent.map((c) => c) : [];

    const filterString: string[] = continentsArray.concat(independentArray);

    setActiveFilters(filterString);
  }

  useEffect(() => {
    updateActiveFilters();
  }, [state]);

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

  const handleFilter = (type: FiltersTypes, order?: Order, value?: string) => {
    setIsLoading(true);
    switch (type) {
      case FiltersTypes.SEARCH:
        dispatch({
          type: ActionTypes.SET_SEARCH,
          payload: value || "",
        });
        break;
      case FiltersTypes.ORDER:
        dispatch({ type: ActionTypes.SET_ORDER, payload: order || Order.ASC });
        break;
      case FiltersTypes.CONTINENTS:
        if (state.continents.includes(value!)) {
          dispatch({
            type: ActionTypes.SET_CONTINENTS,
            payload: state.continents.filter((c) => c !== value),
          });
        } else {
          dispatch({
            type: ActionTypes.SET_CONTINENTS,
            payload: [...state.continents, value || ""],
          });
        }
        break;
      case FiltersTypes.INDEPENDENT:
        if (value === FiltersTypes.INDEPENDENT) {
          if (state.independent.includes(FiltersTypes.INDEPENDENT)) {
            dispatch({
              type: ActionTypes.SET_INDEPENDENT,
              payload: state.independent.filter(
                (c) => c !== FiltersTypes.INDEPENDENT
              ),
            });
          } else {
            dispatch({
              type: ActionTypes.SET_INDEPENDENT,
              payload: [...state.independent, value || ""],
            });
          }
        } else {
          if (state.independent.includes(FiltersTypes.INDEPENDENT_FALSE)) {
            dispatch({
              type: ActionTypes.SET_INDEPENDENT,
              payload: state.independent.filter(
                (c) => c !== FiltersTypes.INDEPENDENT_FALSE
              ),
            });
          } else {
            dispatch({
              type: ActionTypes.SET_INDEPENDENT,
              payload: [...state.independent, value || ""],
            });
          }
        }

        break;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleClearSearch = () => {
    handleFilter(FiltersTypes.SEARCH, undefined, "");
    getCountriesBySearch("");
  };

  function getCountriesBySearch(search: string) {
    if (isLoading) return;

    const countriesStorage = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

    if (state.search === "") {
      setFilteredCountries([]);
      setCountries(JSON.parse(countriesStorage || "[]"));
      setIsLoading(false);
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

    setTimeout(() => {
      setFilteredCountries(filteredIds);
    }, 1000);
  }

  useEffect(() => {
    getCountriesBySearch("");
    onLoadScreen();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(state.search);
      dispatch({
        type: ActionTypes.SET_SEARCH,
        payload: state.search,
      });
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
      <div className={styles.favoritesList}>
        <Filters
          order={state.order}
          favorites={countries
            .filter((country) => country.favorite)
            .map((country) => country.id)}
          handleFilter={handleFilter}
          placeholder={LABELS.SEARCH_BY_COUNTRY_NAME}
          value={state.search}
          onClearSearch={handleClearSearch}
          icon={<MdSearch />}
          continents={ALL_CONTINENTS}
          activeFilters={activeFilters}
        />

        {countries.filter((country) => country.favorite).length > 0 ? (
          <CountryList
            countries={countries
              .filter((c) => {
                if (
                  state.independent.length > 0 &&
                  state.independent.includes(FiltersTypes.INDEPENDENT)
                ) {
                  return c.independent === true;
                } else if (
                  state.independent.length > 0 &&
                  state.independent.includes(FiltersTypes.INDEPENDENT_FALSE)
                ) {
                  return c.independent === false;
                }
                return true;
              })
              .filter((c) => {
                if (state.continents.length > 0) {
                  return state.continents.includes(c.region || "");
                }
                return true;
              })
              .filter((country) => country.favorite)
              .sort((a: CountryRequestProps, b: CountryRequestProps) => {
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
        ) : (
          <div className={styles.noFavorites}>
            <p>Nenhum país favoritado</p>
            <LiaHeartBrokenSolid className={styles.float} />
          </div>
        )}
      </div>
    </div>
  );
}
