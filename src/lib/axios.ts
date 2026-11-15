import axios from "axios";

const api = axios.create({
  baseURL: "https://api.restcountries.com",
});

export default api;
