export type CountryProps = {
  name: string;
  flags: {
    png: string;
    svg: string;
  };
  favorite: boolean;
};

export type CountryRequestProps = {
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
};

export type ActionProps =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };
