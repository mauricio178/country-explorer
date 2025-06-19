"use client";
import {
  CountrySpecification,
  getCountriesEspecification,
} from "@/actions/countries";
import CountryList from "@/components/CountryList";
import Filters, { FiltersTypes } from "@/components/Filters";
import {
  ALL_CONTINENTS,
  LABELS,
  STORAGE_KEY_ALL_COUNTRIES,
} from "@/constants/varibles";
import { useFilters } from "@/hooks/useFilters";
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

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { state, dispatch } = useFilters();

  function updateActiveFilters() {
    const continentsArray =
      state.continents.length > 0 ? state.continents.map((c) => c) : [];
    const independentArray =
      state.independent.length > 0 ? state.independent.map((c) => c) : [];

    const filterString: string[] = continentsArray.concat(independentArray);

    setActiveFilters(filterString);
  }

  const onLoadScreen = async () => {
    setIsLoading(true);
    const storageCountries = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);
    const parsedCountries = JSON.parse(storageCountries || "[]");

    if (parsedCountries.length > 0) {
      setCountries(parsedCountries);
      setIsLoading(false);
      return;
    }

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

  useEffect(() => {
    onLoadScreen();
    updateActiveFilters();
  }, [state]);

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
          handleFilter={handleFilter}
          placeholder={LABELS.SEARCH_BY_COUNTRY_NAME}
          value={state.search}
          continents={ALL_CONTINENTS}
          onClearSearch={() => {
            handleFilter(FiltersTypes.SEARCH, undefined, "");
            getCountriesBySearch("");
          }}
          activeFilters={activeFilters}
          icon={<MdSearch />}
        />

        <div className={styles.list}>
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

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
