import { STORAGE_KEY_ALL_COUNTRIES } from "@/constants/varibles";

export async function GET() {
  const allCountries = localStorage.getItem(STORAGE_KEY_ALL_COUNTRIES);

  return Response.json(allCountries);
}
