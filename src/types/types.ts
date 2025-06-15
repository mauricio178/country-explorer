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

export type ActionProps =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };
