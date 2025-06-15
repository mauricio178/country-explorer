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
    nativeName: {
      fra: {
        official: string;
        common: string;
      };
    };
  };
  favorite: boolean;
};

export type FilterState = {
  search: string;
  sortBy: "name" | "";
};

export type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: "name" | "" };
