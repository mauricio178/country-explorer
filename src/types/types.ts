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
    nativeName: Record<string, { common: string; official: string }>;
  };
  favorite: boolean;
  capital: string[];
  languages: Record<string, string>;
  currencies: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
  region: string;
  independent: boolean;
  subregion: string;
  cioc: string;
};

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export enum ActionTypes {
  SET_ORDER = "SET_ORDER",
  SET_SEARCH = "SET_SEARCH",
  SET_CONTINENTS = "SET_CONTINENTS",
  SET_INDEPENDENT = "SET_INDEPENDENT",
}

export type FilterState = {
  order: string;
  search: string;
  continents: string[];
  independent: string[];
};

export type Action =
  | { type: ActionTypes.SET_ORDER; payload: Order }
  | { type: ActionTypes.SET_CONTINENTS; payload: string[] }
  | { type: ActionTypes.SET_SEARCH; payload: string }
  | { type: ActionTypes.SET_INDEPENDENT; payload: string[] };

export type Continent = {
  name: string;
  id: string;
};
