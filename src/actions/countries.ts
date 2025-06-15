import api from "@/lib/axios";
import { CountryRequestProps } from "@/types/types";
import { AxiosError } from "axios";

export enum CountrySpecification {
  ALL = "/all",
  REGION = "/region",
  INDEPENDENT = "/independent",
  SUBREGION = "/subregion",
}

export const getCountriesEspecification = async (
  specification: CountrySpecification
  // region?: string
) => {
  const customParams =
    specification === CountrySpecification.ALL ? { fields: "name,flags" } : {};

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
