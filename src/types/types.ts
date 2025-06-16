/* eslint-disable @typescript-eslint/no-explicit-any */

export type CountryRequestProps = {
  id: string;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: any | undefined;
  };
  favorite: boolean;
};

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export enum ActionTypes {
  SET_ORDER = "SET_ORDER",
  SET_FAVORITES = "SET_FAVORITES",
  SET_SEARCH = "SET_SEARCH",
}

export type FilterState = {
  order: string;
  search: string;
  favorites: boolean;
};

export type Action =
  | { type: ActionTypes.SET_ORDER; payload: Order }
  | { type: ActionTypes.SET_FAVORITES; payload: boolean }
  | { type: ActionTypes.SET_SEARCH; payload: string };
