import api from "@/lib/axios";
import { CountryRequestProps } from "@/types/types";
import { AxiosError } from "axios";

export enum CountrySpecification {
  ALL = "/all",
  REGION = "/region",
  INDEPENDENT = "/independent",
  SUBREGION = "/subregion",
}

export const countryFields = [
  "name",
  "flags",
  "capital",
  "region",
  "subregion",
  "independent",
  "cioc",
  "currencies",
  "languages",
  "population",
];

export const getCountriesEspecification = async (
  specification: CountrySpecification
) => {
  const customParams =
    specification === CountrySpecification.ALL
      ? { fields: countryFields.join(",") }
      : {};

  return await api
    .get<CountryRequestProps[]>(specification, {
      params: customParams,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.error(error);
      return null;
    });
};
