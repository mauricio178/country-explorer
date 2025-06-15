import { Action, FilterState } from "@/types/types";
import { useReducer, useEffect } from "react";

export const filterReducer = (
  state: FilterState,
  action: Action
): FilterState => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    default:
      return state;
  }
};

export function useFilters() {
  const defaultFilters: FilterState = {
    search: "",
    sortBy: "",
  };

  const STORAGE_KEY = "filtros-app";

  const getInitialState = (): FilterState => {
    if (typeof window === "undefined") return defaultFilters;

    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultFilters;
  };

  const [state, dispatch] = useReducer(
    filterReducer,
    defaultFilters,
    getInitialState
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
