import { FILTERS_STORAGE_KEY } from "@/constants/varibles";
import { Action, ActionTypes, FilterState } from "@/types/types";
import { useReducer, useEffect } from "react";

export const filterReducer = (
  state: FilterState,
  action: Action
): FilterState => {
  switch (action.type) {
    case ActionTypes.SET_ORDER:
      return { ...state, order: action.payload };
    case ActionTypes.SET_SEARCH:
      return { ...state, search: action.payload };
    case ActionTypes.SET_CONTINENTS:
      return { ...state, continents: action.payload };
    default:
      return state;
  }
};

export function useFilters() {
  const defaultFilters: FilterState = {
    order: "asc",
    search: "",
    continents: [],
  };

  const getInitialState = (): FilterState => {
    if (typeof window === "undefined") return defaultFilters;

    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultFilters;
  };

  const [state, dispatch] = useReducer(
    filterReducer,
    defaultFilters,
    getInitialState
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
