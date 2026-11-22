"use server";

import api from "@/lib/axios";
import { CountryRequestProps } from "@/types/types";
import { AxiosError } from "axios";

const PAGE_SIZE = 100;

const RESPONSE_FIELDS = [
  "names.common",
  "names.official",
  "names.native",
  "flag.url_png",
  "flag.url_svg",
  "flag.description",
  "capitals",
  "region",
  "subregion",
  "languages",
  "currencies",
  "codes.cioc",
  "classification.sovereign",
  "population",
].join(",");

type NativeName = {
  common?: string;
  official?: string;
};

type CountryV5 = {
  names?: {
    common?: string;
    official?: string;
    native?: Record<string, NativeName>;
  };
  flag?: {
    url_png?: string;
    url_svg?: string;
    description?: string;
  };
  capitals?: { name?: string }[];
  region?: string;
  subregion?: string;
  languages?: {
    name?: string;
    bcp47?: string;
    iso639_3?: string;
  }[];
  currencies?: {
    code?: string;
    name?: string;
    symbol?: string;
  }[];
  codes?: {
    cioc?: string;
  };
  classification?: {
    sovereign?: boolean;
  };
  population?: number;
};

type CountriesApiResponse = {
  data?: {
    objects?: CountryV5[];
    meta?: {
      more?: boolean;
    };
  };
  errors?: { message?: string }[];
};

function getApiKey() {
  return process.env["REST_COUNTRIES_API_KEY"] ?? "";
}

function mapCountry(country: CountryV5): CountryRequestProps {
  const nativeName = Object.fromEntries(
    Object.entries(country.names?.native ?? {}).map(([code, value]) => [
      code,
      {
        common: value.common ?? "",
        official: value.official ?? "",
      },
    ])
  );

  const languages = Object.fromEntries(
    (country.languages ?? [])
      .filter((language) => language.name)
      .map((language) => [
        language.iso639_3 || language.bcp47 || language.name,
        language.name as string,
      ])
  );

  const currencies = Object.fromEntries(
    (country.currencies ?? [])
      .filter((currency) => currency.code)
      .map((currency) => [
        currency.code as string,
        {
          name: currency.name ?? "",
          symbol: currency.symbol ?? "",
        },
      ])
  );

  return {
    id: "",
    flags: {
      png: country.flag?.url_png ?? "",
      svg: country.flag?.url_svg ?? "",
      alt: country.flag?.description || country.names?.common || "",
    },
    name: {
      common: country.names?.common ?? "",
      official: country.names?.official ?? "",
      nativeName,
    },
    favorite: false,
    capital: (country.capitals ?? [])
      .map((capital) => capital.name)
      .filter((name): name is string => Boolean(name)),
    languages,
    currencies,
    region: country.region ?? "",
    independent: country.classification?.sovereign ?? false,
    subregion: country.subregion ?? "",
    cioc: country.codes?.cioc ?? "",
    population: country.population ?? 0,
  };
}

async function fetchCountriesPage(offset: number) {
  const response = await api.get<CountriesApiResponse>("/countries/v5", {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
    params: {
      limit: PAGE_SIZE,
      offset,
      response_fields: RESPONSE_FIELDS,
    },
  });

  return response.data;
}

export async function getCountries(): Promise<CountryRequestProps[] | null> {
  if (!getApiKey()) {
    console.error(
      "REST_COUNTRIES_API_KEY is not set. Create a key at https://restcountries.com/sign-up"
    );
    return null;
  }

  try {
    const countries: CountryRequestProps[] = [];
    let offset = 0;
    let more = true;

    while (more) {
      const page = await fetchCountriesPage(offset);
      const objects = page.data?.objects ?? [];

      countries.push(...objects.map(mapCountry));

      more = Boolean(page.data?.meta?.more) && objects.length > 0;
      offset += objects.length || PAGE_SIZE;

      if (objects.length === 0 || offset > PAGE_SIZE * 20) {
        break;
      }
    }

    return countries;
  } catch (error) {
    const axiosError = error as AxiosError<CountriesApiResponse>;
    const message =
      axiosError.response?.data?.errors
        ?.map((item) => item.message)
        .filter(Boolean)
        .join(" ") || axiosError.message;

    console.error(message);
    return null;
  }
}
